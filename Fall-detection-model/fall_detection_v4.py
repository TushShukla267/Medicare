# fall_detection_v4.py
import time
import numpy as np
from collections import deque
from enum import Enum
import config_v4 as config

class FallState(Enum):
    NORMAL = 1
    POTENTIAL_FALL = 2
    FALL_CONFIRMED = 3

class FallDetectorV4:
    def __init__(self):
        self.state = FallState.NORMAL
        self.hip_y_history = deque(maxlen=30)
        self.smoothed_person_height = None
        self.timestamps = {"potential_fall": 0, "fall_confirmed": 0}
        self.last_pose_landmarks = None
        self.debug_info = {}

    def _update_smoothed_height(self, landmarks):
        try:
            shoulder_y = (landmarks[11].y + landmarks[12].y) / 2
            ankle_y = (landmarks[27].y + landmarks[28].y) / 2
            current_height = abs(ankle_y - shoulder_y)
            
            if current_height < 0.1: return # Ignore bad readings
            
            if self.smoothed_person_height is None:
                self.smoothed_person_height = current_height
            else:
                # Exponential moving average for smoothing
                self.smoothed_person_height = (config.HEIGHT_SMOOTHING_FACTOR * current_height) + \
                                             ((1 - config.HEIGHT_SMOOTHING_FACTOR) * self.smoothed_person_height)
        except:
            pass # Keep last known height on error

    def _calculate_torso_angle(self, landmarks):
        # ... (same as v3)
        try:
            shoulder_l, shoulder_r = landmarks[11], landmarks[12]
            hip_l, hip_r = landmarks[23], landmarks[24]
            shoulder_mid = np.array([(shoulder_l.x + shoulder_r.x) / 2, (shoulder_l.y + shoulder_r.y) / 2])
            hip_mid = np.array([(hip_l.x + hip_r.x) / 2, (hip_l.y + hip_r.y) / 2])
            torso_vector = hip_mid - shoulder_mid
            vertical_vector = np.array([0, -1])
            dot_product = np.dot(torso_vector, vertical_vector) / np.linalg.norm(torso_vector)
            return np.arccos(dot_product) * 180.0 / np.pi
        except: return None

    def _calculate_aspect_ratio(self, landmarks):
        # ... (same as v3)
        x_coords = [lm.x for lm in landmarks]; y_coords = [lm.y for lm in landmarks]
        width = max(x_coords) - min(x_coords); height = max(y_coords) - min(y_coords)
        return height / width if width > 0 else 1.0

    def _check_inactivity(self, current_landmarks):
        # ... (same as v3)
        if self.last_pose_landmarks is None: return False
        movement = sum(np.sqrt((lm.x - self.last_pose_landmarks[i].x)**2 + 
                               (lm.y - self.last_pose_landmarks[i].y)**2) 
                       for i, lm in enumerate(current_landmarks))
        return (movement / len(current_landmarks)) < config.INACTIVITY_MOVEMENT_THRESHOLD

    def process_pose(self, pose_landmarks):
        if not pose_landmarks:
            self.debug_info = {}
            return {"status": self.state.name, "fall_detected": False, "debug_info": {}}

        landmarks = pose_landmarks.landmark
        self.debug_info = {} # Reset debug info
        
        # --- State Machine Logic ---
        if self.state == FallState.NORMAL:
            self._update_smoothed_height(landmarks)
            current_hip_y = (landmarks[23].y + landmarks[24].y) / 2
            self.hip_y_history.append(current_hip_y)
            
            drop_distance = 0
            if len(self.hip_y_history) == self.hip_y_history.maxlen and self.smoothed_person_height:
                max_hip_y_in_window = max(self.hip_y_history)
                drop_distance = max_hip_y_in_window - current_hip_y
                
                if drop_distance > config.HEIGHT_DROP_THRESHOLD * self.smoothed_person_height:
                    print(f"[STATE TRANSITION] NORMAL -> POTENTIAL_FALL (Drop of {drop_distance:.2f} detected)")
                    self.state = FallState.POTENTIAL_FALL
                    self.timestamps["potential_fall"] = time.time()
            self.debug_info['person_ht'] = self.smoothed_person_height or 0
            self.debug_info['drop_dist'] = drop_distance

        elif self.state == FallState.POTENTIAL_FALL:
            is_inactive = self._check_inactivity(landmarks)
            torso_angle = self._calculate_torso_angle(landmarks)
            aspect_ratio = self._calculate_aspect_ratio(landmarks)
            
            is_on_ground = (torso_angle is not None and torso_angle > config.TORSO_ANGLE_THRESHOLD) or \
                           (aspect_ratio < config.ASPECT_RATIO_THRESHOLD)
            
            if is_on_ground and is_inactive:
                time_since_fall = time.time() - self.timestamps["potential_fall"]
                if time_since_fall >= config.CONFIRMATION_TIME_THRESHOLD:
                    print("[STATE TRANSITION] POTENTIAL_FALL -> FALL_CONFIRMED")
                    self.state = FallState.FALL_CONFIRMED
                    self.timestamps["fall_confirmed"] = time.time()
            else: # If person moves or gets up, reset
                print("[STATE TRANSITION] POTENTIAL_FALL -> NORMAL (Resetting)")
                self.state = FallState.NORMAL
                self.hip_y_history.clear()

            self.debug_info['torso_angle'] = torso_angle or 0
            self.debug_info['aspect_ratio'] = aspect_ratio
            self.debug_info['is_inactive'] = is_inactive
            self.debug_info['is_on_ground'] = is_on_ground

        elif self.state == FallState.FALL_CONFIRMED:
            if time.time() - self.timestamps["fall_confirmed"] > config.FALL_RESET_TIMEOUT:
                print("[STATE TRANSITION] FALL_CONFIRMED -> NORMAL (Resetting)")
                self.state = FallState.NORMAL
                self.hip_y_history.clear()

        self.last_pose_landmarks = landmarks
        
        return {
            "status": self.state.name, 
            "fall_detected": self.state == FallState.FALL_CONFIRMED,
            "debug_info": self.debug_info
        }