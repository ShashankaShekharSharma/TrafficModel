
import random
import time
import asyncio
import streamlit as st
from typing import Dict, List, Optional
import numpy as np
import g4f
from g4f.client import Client
from dataclasses import dataclass
from collections import deque
import pygame
import sys

# PyGame Configuration
pygame.init()
SCREEN_WIDTH, SCREEN_HEIGHT = 900, 600
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("Adaptive Traffic Management System")
clock = pygame.time.Clock()

# Configuration
@dataclass
class SimulationConfig:
    DEFAULT_RED: int = 150
    DEFAULT_YELLOW: int = 5
    DEFAULT_GREEN: int = 20
    DEFAULT_MIN: int = 10
    DEFAULT_MAX: int = 60
    NUM_SIGNALS: int = 4
    SIM_TIME: int = 300
    GAP: int = 15
    MOVING_GAP: int = 15

# Vehicle configurations
VEHICLE_CONFIGS = {
    'speeds': {'car': 2.25, 'bus': 1.8, 'truck': 1.8, 'rickshaw': 2, 'bike': 2.5},
    'colors': {'car': 'blue', 'bus': 'red', 'truck': 'gray', 'rickshaw': 'green', 
               'bike': 'yellow', 'emergency': 'red'},
    'sizes': {'car': (30, 20), 'bus': (40, 20), 'truck': (40, 20), 
              'rickshaw': (25, 15), 'bike': (20, 10), 'emergency': (35, 20)}
}

class WeatherConditions:
    def __init__(self):
        self.conditions = {
            'rain': 0.0,
            'fog': 0.0,
            'wind': 0.0
        }
        self.update_interval = 100  # Update weather every 100 simulation steps
        self.last_update = 0

    def update(self):
        self.last_update += 1
        if self.last_update >= self.update_interval:
            self.conditions['rain'] = random.random()
            self.conditions['fog'] = random.random() * 0.8  # Less intense fog
            self.conditions['wind'] = random.random() * 0.6  # Moderate wind
            self.last_update = 0

    def get_speed_modifier(self) -> float:
        # Calculate speed reduction based on weather conditions
        rain_effect = 1 - (self.conditions['rain'] * 0.3)  # Up to 30% slower in rain
        fog_effect = 1 - (self.conditions['fog'] * 0.2)   # Up to 20% slower in fog
        wind_effect = 1 - (self.conditions['wind'] * 0.1)  # Up to 10% slower in wind
        return min(rain_effect, fog_effect, wind_effect)

class EmergencyVehicleHandler:
    def __init__(self):
        self.emergency_probability = 0.001  # Probability of emergency vehicle spawn
        self.active_emergency = False
        self.emergency_cooldown = 200  # Minimum time between emergency vehicles
        self.last_emergency = 0

    def update(self, simulation):
        if not self.active_emergency and self.last_emergency > self.emergency_cooldown:
            if random.random() < self.emergency_probability:
                self._spawn_emergency_vehicle(simulation)
                self.last_emergency = 0
        
        self.last_emergency += 1
        self._update_emergency_status(simulation)

    def _spawn_emergency_vehicle(self, simulation):
        direction = random.choice(['right', 'down', 'left', 'up'])
        lane = random.randint(0, 2)
        emergency_vehicle = Vehicle(lane, 'emergency', direction, False)
        if simulation._is_safe_to_spawn(emergency_vehicle):
            simulation.vehicles.append(emergency_vehicle)
            self.active_emergency = True

    def _update_emergency_status(self, simulation):
        if self.active_emergency:
            emergency_vehicles = [v for v in simulation.vehicles 
                                if v.type == 'emergency']
            if not emergency_vehicles:
                self.active_emergency = False

class AITrafficOptimizer:
    def __init__(self):
        self.client = Client()
        self.history = deque(maxlen=10)
        self.model = "gpt-4o-mini"

    async def get_optimal_timing(self, current_state: Dict) -> Dict:
        try:
            context = self._prepare_ai_context(current_state)
            response = await self._get_ai_recommendation(context)
            timing = self._parse_ai_response(response)
            
            self.history.append({
                'state': current_state,
                'recommendation': timing
            })
            
            return timing
        except Exception as e:
            st.error(f"AI optimization error: {str(e)}")
            return self._get_fallback_timing()

    async def _get_ai_recommendation(self, context: str) -> str:
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": context}],
                web_search=False
            )
            return response.choices[0].message.content
        except Exception:
            return self._get_fallback_timing()

    def _prepare_ai_context(self, state: Dict) -> str:
        return f"""
        Current traffic state:
        - Waiting vehicles: {state['waiting_vehicles']}
        - Flow rates: {state['flow_rates']}
        - Congestion levels: {state['congestion']}
        - Time of day: {state['time_of_day']}
        
        Recommend optimal signal timings based on this data.
        """

    def _parse_ai_response(self, response: str) -> Dict:
        try:
            base_time = 20
            waiting_vehicles = [int(x) for x in response.split() if x.isdigit()][:4]
            if not waiting_vehicles:
                waiting_vehicles = [0] * 4
                
            green_times = [
                min(max(base_time + w * 2, SimulationConfig.DEFAULT_MIN),
                    SimulationConfig.DEFAULT_MAX) 
                for w in waiting_vehicles
            ]
            
            return {
                'green_times': green_times,
                'cycle_length': sum(green_times) + 
                               SimulationConfig.NUM_SIGNALS * SimulationConfig.DEFAULT_YELLOW
            }
        except Exception:
            return self._get_fallback_timing()

    def _get_fallback_timing(self) -> Dict:
        return {
            'green_times': [SimulationConfig.DEFAULT_GREEN] * SimulationConfig.NUM_SIGNALS,
            'cycle_length': (SimulationConfig.DEFAULT_GREEN * SimulationConfig.NUM_SIGNALS + 
                           SimulationConfig.DEFAULT_YELLOW * SimulationConfig.NUM_SIGNALS)
        }

class Vehicle:
    def __init__(self, lane: int, vehicle_type: str, direction: str, will_turn: bool):
        self.lane = lane
        self.type = vehicle_type
        self.speed = VEHICLE_CONFIGS['speeds'].get(vehicle_type, 2.0)
        self.direction = direction
        self.position = self._initialize_position()
        self.size = VEHICLE_CONFIGS['sizes'].get(vehicle_type, (30, 20))
        self.color = VEHICLE_CONFIGS['colors'].get(vehicle_type, 'gray')
        self.crossed = False
        self.will_turn = will_turn
        self.turned = False
        self.creation_time = time.time()
        self.wait_time = 0
        self.stop_position = self._calculate_stop_position()
        self.priority = vehicle_type == 'emergency'

    def _initialize_position(self) -> tuple:
        positions = {
            'right': (50, 200 + self.lane * 20),
            'down': (450 - self.lane * 20, 50),
            'left': (850, 300 - self.lane * 20),
            'up': (400 + self.lane * 20, 550)
        }
        return positions[self.direction]

    def _calculate_stop_position(self) -> float:
        stop_lines = {'right': 350, 'down': 200, 'left': 550, 'up': 400}
        return stop_lines[self.direction] - self.size[0] - SimulationConfig.GAP

    def move(self, current_green: int, current_yellow: int, vehicles_ahead: List['Vehicle'],
            weather_modifier: float = 1.0) -> None:
        if self._can_move(current_green, current_yellow, vehicles_ahead):
            modified_speed = self.speed * weather_modifier
            if self.direction in ['right', 'left']:
                new_x = self.position[0] + (modified_speed if self.direction == 'right' else -modified_speed)
                new_y = self.position[1]
            else:  # up or down
                new_x = self.position[0]
                new_y = self.position[1] + (modified_speed if self.direction == 'down' else -modified_speed)
            
            self.position = (new_x, new_y)
            self._check_crossing()
        else:
            self.wait_time += 1

    def _can_move(self, current_green: int, current_yellow: int, vehicles_ahead: List['Vehicle']) -> bool:
        if self.crossed:
            return True
        
        direction_numbers = {'right': 0, 'down': 1, 'left': 2, 'up': 3}
        if not self.priority and current_green != direction_numbers[self.direction] and not current_yellow:
            return False

        if vehicles_ahead:
            next_vehicle = vehicles_ahead[0]
            if self._distance_to(next_vehicle) < SimulationConfig.MOVING_GAP:
                return False

        return True

    def _distance_to(self, other: 'Vehicle') -> float:
        return ((self.position[0] - other.position[0]) ** 2 + 
                (self.position[1] - other.position[1]) ** 2) ** 0.5

    def _check_crossing(self) -> None:
        if not self.crossed:
            stop_lines = {'right': 350, 'down': 200, 'left': 550, 'up': 400}
            if ((self.direction in ['right', 'left'] and 
                 abs(self.position[0] - stop_lines[self.direction]) > 50) or
                (self.direction in ['up', 'down'] and 
                 abs(self.position[1] - stop_lines[self.direction]) > 50)):
                self.crossed = True

class TrafficSimulation:
    def __init__(self):
        self.config = SimulationConfig()
        self.ai_optimizer = AITrafficOptimizer()
        self.vehicles = []
        self.current_green = 0
        self.current_yellow = False
        self.time_elapsed = 0
        self.stats = {
            'total_vehicles': 0,
            'waiting_times': [],
            'throughput': []
        }
        self.weather = WeatherConditions()
        self.emergency_handler = EmergencyVehicleHandler()

    def _count_waiting_vehicles(self) -> List[int]:
        waiting_counts = [0] * 4
        direction_map = {'right': 0, 'down': 1, 'left': 2, 'up': 3}
        
        for vehicle in self.vehicles:
            if not vehicle.crossed:
                direction_index = direction_map[vehicle.direction]
                waiting_counts[direction_index] += 1
                
        return waiting_counts

    def _calculate_flow_rates(self) -> List[float]:
        flow_rates = [0] * 4
        direction_map = {'right': 0, 'down': 1, 'left': 2, 'up': 3}
        time_window = 60
        start_time = max(0, self.time_elapsed - time_window)
        
        for vehicle in self.vehicles:
            if vehicle.crossed:
                direction_index = direction_map[vehicle.direction]
                flow_rates[direction_index] += 1
                
        return [rate / time_window for rate in flow_rates]

    def _calculate_congestion_levels(self) -> List[float]:
        congestion_levels = [0] * 4
        direction_map = {'right': 0, 'down': 1, 'left': 2, 'up': 3}
        
        for vehicle in self.vehicles:
            if not vehicle.crossed:
                direction_index = direction_map[vehicle.direction]
                congestion_levels[direction_index] += 0.1
                
        return [min(level, 1.0) for level in congestion_levels]

    async def update(self):
        self.weather.update()
        self.emergency_handler.update(self)
        await self._update_signals()
        self._update_vehicles()
        self._generate_vehicles()
        self._update_stats()
        self.time_elapsed += 1

    async def _update_signals(self):
        state = self._get_current_state()
        timing = await self.ai_optimizer.get_optimal_timing(state)
        self._apply_signal_timing(timing)

    def _get_current_state(self) -> Dict:
        return {
            'waiting_vehicles': self._count_waiting_vehicles(),
            'flow_rates': self._calculate_flow_rates(),
            'congestion': self._calculate_congestion_levels(),
            'time_of_day': time.localtime().tm_hour
        }

    def _apply_signal_timing(self, timing: Dict):
        if self.current_yellow:
            return
            
        green_times = timing['green_times']
        if self.time_elapsed % timing['cycle_length'] == 0:
            self.current_yellow = True
            self.current_green = (self.current_green + 1) % 4
        elif self.time_elapsed % timing['cycle_length'] == SimulationConfig.DEFAULT_YELLOW:
            self.current_yellow = False

    def _update_vehicles(self):
        weather_modifier = self.weather.get_speed_modifier()
        for vehicle in self.vehicles[:]:
            vehicle.move(
                self.current_green,
                self.current_yellow,
                self._get_vehicles_ahead(vehicle),
                weather_modifier
            )
            if self._is_vehicle_out_of_bounds(vehicle):
                self.vehicles.remove(vehicle)

    def _get_vehicles_ahead(self, vehicle: Vehicle) -> List[Vehicle]:
        return [v for v in self.vehicles 
                if v != vehicle and 
                v.direction == vehicle.direction and 
                v.lane == vehicle.lane and 
                not v.crossed and 
                self._is_ahead(vehicle, v)]

    def _is_ahead(self, vehicle1: Vehicle, vehicle2: Vehicle) -> bool:
        if vehicle1.direction in ['right', 'left']:
            return ((vehicle1.direction == 'right' and 
                    vehicle2.position[0] > vehicle1.position[0]) or
                   (vehicle1.direction == 'left' and 
                    vehicle2.position[0] < vehicle1.position[0]))
        else:
            return ((vehicle1.direction == 'down' and 
                    vehicle2.position[1] > vehicle1.position[1]) or
                   (vehicle1.direction == 'up' and 
                    vehicle2.position[1] < vehicle1.position[1]))
                    
    def _generate_vehicles(self):
        if random.random() < 0.3 and len(self.vehicles) < 50:
            vehicle_type = random.choice(list(VEHICLE_CONFIGS['speeds'].keys()))
            direction = random.choice(['right', 'down', 'left', 'up'])
            lane = random.randint(0, 2)
            will_turn = random.random() < 0.4
            
            new_vehicle = Vehicle(lane, vehicle_type, direction, will_turn)
            if self._is_safe_to_spawn(new_vehicle):
                self.vehicles.append(new_vehicle)

    def _is_vehicle_out_of_bounds(self, vehicle: Vehicle) -> bool:
        x, y = vehicle.position
        return (x < -50 or x > 950 or y < -50 or y > 650)

    def _is_safe_to_spawn(self, vehicle: Vehicle) -> bool:
        return not any(
            existing.direction == vehicle.direction and
            existing.lane == vehicle.lane and
            self._distance_between_positions(existing.position, vehicle.position) < SimulationConfig.GAP * 2
            for existing in self.vehicles
        )

    def _distance_between_positions(self, pos1: tuple, pos2: tuple) -> float:
        return ((pos1[0] - pos2[0]) ** 2 + (pos1[1] - pos2[1]) ** 2) ** 0.5

    def _update_stats(self):
        self.stats['total_vehicles'] = len([v for v in self.vehicles if v.crossed])
        waiting_times = [v.wait_time for v in self.vehicles if not v.crossed]
        
        if waiting_times:
            self.stats['waiting_times'].append(sum(waiting_times) / len(waiting_times))
        
        self.stats['throughput'].append(
            self.stats['total_vehicles'] / (self.time_elapsed + 1)
        )

    def render(self):
        screen.fill((85, 85, 85))  # Dark gray background for roads

        # Draw roads and intersection
        pygame.draw.rect(screen, (0, 0, 0), (300, 150, 300, 300), 2)  # Intersection
        for y in range(150, 451, 20):  # Horizontal road markings
            pygame.draw.line(screen, (255, 255, 255), (0, y), (900, y), 1)
        for x in range(300, 601, 20):  # Vertical road markings
            pygame.draw.line(screen, (255, 255, 255), (x, 0), (x, 600), 1)

        # Draw vehicles
        for vehicle in self.vehicles:
            pygame.draw.rect(screen, vehicle.color, (*vehicle.position, *vehicle.size))

        # Draw traffic signals
        signal_positions = [(300, 150), (600, 150), (600, 450), (300, 450)]
        for i, pos in enumerate(signal_positions):
            color = self._get_signal_color(i)
            pygame.draw.circle(screen, color, pos, 10)

        # Draw weather effects
        if self.weather.conditions['rain'] > 0.3:
            self._draw_rain()
        if self.weather.conditions['fog'] > 0.3:
            self._draw_fog()

        pygame.display.flip()

    def _get_signal_color(self, signal_index: int) -> tuple:
        if signal_index == self.current_green:
            return (255, 255, 0) if self.current_yellow else (0, 255, 0)  # Yellow or Green
        return (255, 0, 0)  # Red

    def _draw_rain(self):
        intensity = self.weather.conditions['rain']
        num_drops = int(intensity * 100)
        for _ in range(num_drops):
            x = random.randint(0, SCREEN_WIDTH)
            y = random.randint(0, SCREEN_HEIGHT)
            pygame.draw.line(screen, (0, 0, 255), (x, y), (x - 5, y - 5), 1)

    def _draw_fog(self):
        intensity = self.weather.conditions['fog']
        fog_surface = pygame.Surface((SCREEN_WIDTH, SCREEN_HEIGHT))
        fog_surface.set_alpha(int(intensity * 100))
        fog_surface.fill((255, 255, 255))
        screen.blit(fog_surface, (0, 0))

async def main():
    st.set_page_config(page_title="AI Traffic Simulation", layout="wide")
    st.title("AI Traffic Simulation")

    if 'simulation' not in st.session_state:
        st.session_state.simulation = TrafficSimulation()
        st.session_state.running = False

    # Sidebar controls
    st.sidebar.title("Simulation Controls")
    if st.sidebar.button("Start/Stop Simulation"):
        st.session_state.running = not st.session_state.running

    # Weather display
    st.sidebar.subheader("Weather Conditions")
    weather = st.session_state.simulation.weather.conditions
    st.sidebar.progress(weather['rain'], "Rain")
    st.sidebar.progress(weather['fog'], "Fog")
    st.sidebar.progress(weather['wind'], "Wind")

    # Main display area
    col1, col2 = st.columns([3, 1])
    
    with col1:
        st.subheader("Traffic Simulation")
        st.write("Simulation will run in a separate PyGame window.")

    with col2:
        st.subheader("Statistics")
        stats_placeholder = st.empty()

    # PyGame loop
    while True:
        if st.session_state.running:
            await st.session_state.simulation.update()
            st.session_state.simulation.render()
            
            with stats_placeholder:
                stats = st.session_state.simulation.stats
                st.metric("Total Vehicles", stats['total_vehicles'])
                st.metric("Average Wait Time", 
                         round(sum(stats['waiting_times'][-10:]) / 10 
                               if stats['waiting_times'] else 0, 2))
                st.metric("Throughput", 
                         round(stats['throughput'][-1], 2) 
                         if stats['throughput'] else 0)
                st.metric("Time Elapsed", st.session_state.simulation.time_elapsed)
        
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
        
        clock.tick(30)  # Limit to 30 FPS
        await asyncio.sleep(0.1)

if __name__ == "__main__":
    asyncio.run(main())
