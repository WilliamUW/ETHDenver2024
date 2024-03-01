import streamlit as st
from streamlit_webrtc import webrtc_streamer, VideoTransformerBase
import cv2
import mediapipe as mp
import numpy as np
import PoseModule as pm

class PoseDetector(VideoTransformerBase):
    def __init__(self):
        self.detector = pm.poseDetector()
        self.count = 0
        self.direction = 0
        self.form = 0
        self.feedback = "Fix Form"

    def transform(self, frame):
        img = frame.to_ndarray(format="bgr24")

        img = self.detector.findPose(img, False)
        lmList = self.detector.findPosition(img, False)
        if len(lmList) != 0:
            elbow = self.detector.findAngle(img, 11, 13, 15)
            shoulder = self.detector.findAngle(img, 13, 11, 23)
            hip = self.detector.findAngle(img, 11, 23, 25)

            per = np.interp(elbow, (90, 160), (0, 100))
            bar = np.interp(elbow, (90, 160), (380, 50))

            if elbow > 160 and shoulder > 40 and hip > 160:
                self.form = 1

            if self.form == 1:
                if per == 0:
                    if elbow <= 90 and hip > 160:
                        self.feedback = "Up"
                        if self.direction == 0:
                            self.count += 0.5
                            self.direction = 1
                    else:
                        self.feedback = "Fix Form"
                    
                if per == 100:
                    if elbow > 160 and shoulder > 40 and hip > 160:
                        self.feedback = "Down"
                        if self.direction == 1:
                            self.count += 0.5
                            self.direction = 0
                    else:
                        self.feedback = "Fix Form"

            if self.form == 1:
                cv2.rectangle(img, (580, 50), (600, 380), (0, 255, 0), 3)
                cv2.rectangle(img, (580, int(bar)), (600, 380), (0, 255, 0), cv2.FILLED)
                cv2.putText(img, f'{int(per)}%', (565, 430), cv2.FONT_HERSHEY_PLAIN, 2, (255, 0, 0), 2)

            cv2.rectangle(img, (0, 380), (100, 480), (0, 255, 0), cv2.FILLED)
            cv2.putText(img, str(int(self.count)), (25, 455), cv2.FONT_HERSHEY_PLAIN, 5, (255, 0, 0), 5)

            cv2.rectangle(img, (500, 0), (640, 40), (255, 255, 255), cv2.FILLED)
            cv2.putText(img, self.feedback, (500, 40 ), cv2.FONT_HERSHEY_PLAIN, 2, (0, 255, 0), 2)

        # The returned image will be sent to the web browser.
        return img

def main():
    st.title("Pushup Counter and Form Feedback")

    # We use the key parameter to avoid remounting the component when the script reruns.
    webrtc_streamer(
        key="pushup_detector", 
        video_processor_factory=PoseDetector,
        media_stream_constraints={"video": True, "audio": False}
    )

if __name__ == "__main__":
    main()
