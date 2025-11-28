# alert_system.py
import json
import datetime
from playsound import playsound

class AlertSystem:
    """
    Manages alerting based on fall detection results.
    """
    def __init__(self, log_file="fall_log.json", alarm_sound="alarm.mp3"):
        self.log_file = log_file
        self.alarm_sound = alarm_sound

    def get_action(self, confidence: float) -> str:
        """Determines the recommended action based on confidence."""
        if confidence >= 0.9:
            return "call_emergency"
        elif confidence >= 0.75:
            return "notify_caregiver"
        else:
            return "log_only"

    def trigger_alert(self, action: str):
        """Triggers an alert based on the recommended action."""
        if action == "call_emergency":
            print("\033[91m [EMERGENCY] High-confidence fall detected! Sounding alarm. \033[0m")
            try:
                # Note: playsound can be blocking. For a real app, run in a separate thread.
                # Create a dummy alarm.mp3 or use an existing sound file.
                playsound(self.alarm_sound, block=False)
            except Exception as e:
                print(f"[WARNING] Could not play alarm sound: {e}")
                
        elif action == "notify_caregiver":
            print("\033[93m [WARNING] Potential fall detected. Notifying caregiver. \033[0m")
            # In a real system, this would trigger an SMS, push notification, etc.
        
    def log_event(self, event_data: dict):
        """Logs the detection event to a file."""
        print(f"[INFO] Logging event. Confidence: {event_data['confidence']:.2f}, Action: {event_data['recommended_action']}")
        try:
            with open(self.log_file, "a") as f:
                f.write(json.dumps(event_data) + "\n")
        except Exception as e:
            print(f"[ERROR] Could not write to log file: {e}")

    def process_detection(self, detection_result: dict, pose_keypoints: list, bbox: list):
        """
        Processes a detection result, determines action, triggers alerts, and logs it.
        Returns the final structured JSON output.
        """
        timestamp = datetime.datetime.utcnow().isoformat() + "Z"
        confidence = detection_result.get('confidence', 0.0)
        action = self.get_action(confidence)
        
        json_output = {
            "timestamp_utc": timestamp,
            "fall_detected": detection_result.get('fall_detected', False),
            "fall_type": "fall_generic", # Can be enhanced with more logic
            "confidence": round(confidence, 2),
            "primary_subject_bbox": bbox,
            "pose_keypoints": pose_keypoints,
            "motion_summary": detection_result.get('motion_summary', {}),
            "recommended_action": action
        }

        if confidence >= 0.75:
            self.trigger_alert(action)
        
        # Always log if any confidence > 0
        if confidence > 0.1:
            self.log_event(json_output)

        return json_output