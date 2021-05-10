#!/usr/bin/python3

import socket
from time import sleep
import asyncio
import websockets
import json

import PyATEMMax


class AtemSwitcher(object):
    def __init__(self, atem_ip):
        print ("Attempting to connect to ATEM Switcher")
        self.switcher = PyATEMMax.ATEMMax()
        self.switcher.connect(atem_ip)
        self.switcher.waitForConnection()
        print ("Connected to ATEM Switcher")
    
    def input(self, video_in):
        self.switcher.setProgramInputVideoSource(0,video_in)

class ViscaCamera(object):
   def __init__(self, camera_ip, camera_port):
      self.camera_ip = camera_ip
      self.camera_port = camera_port
      print ("Attempting to connect to Camera IP")
      while True:
        try:
            self.socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            break
            sleep(.5)
        except:
            pass
        
      print("Connected to Camera IP")
      
      self.sequence_number = 1 # a variable that we'll iterate each command, remember 0x0001
      self.reset_sequence_number = '02 00 00 01 00 00 00 01 01'

      self.camera_on = '81 01 04 00 02 FF'
      self.camera_off = '81 01 04 00 03 FF'

      self.information_display_on = '81 01 7E 01 18 02 FF'
      self.information_display_off = '81 01 7E 01 18 03 FF'

      self.zoom_stop = '81 01 04 07 00 FF'
      self.zoom_tele = '81 01 04 07 02 FF'
      self.zoom_wide = '81 01 04 07 03 FF'
      self.zoom_tele_variable = '81 01 04 07 2%s FF' # p=0 (Low) to 7 (High)
      self.zoom_wide_variable = '81 01 04 07 3%s FF' # p=0 (Low) to 7 (High)
      self.zoom_direct = '81 01 04 47 0p 0q 0r 0s FF' # pqrs: Zoom Position

      self.memory_reset = '81 01 04 3F 00 0p FF'
      self.memory_set = '81 01 04 3F 01 0p FF' # p: Memory number (=0 to F)
      self.memory_recall = '81 01 04 3F 02 0p FF' # p: Memory number (=0 to F)

    
      # Pan speed setting 0x01 (low speed) to 0x18
      # Tilt speed setting 0x01 (low speed) to 0x17
     
      self.pan_speed = '05'
      self.tilt_speed = '05'

      # self.pan_up = ('81 01 06 01 %s %s 03 01 FF' % (str(self.pan_speed), str(self.tilt_speed)))
      # self.pan_down = ('81 01 06 01 %s %s 03 02 FF' % (str(self.pan_speed), str(self.tilt_speed)))
      # self.pan_left = ('81 01 06 01 %s %s 01 03 FF' % (str(self.pan_speed), str(self.tilt_speed)))
      # self.pan_right = ('81 01 06 01 %s %s 02 03 FF' % (str(self.pan_speed), str(self.tilt_speed)))
      # self.pan_up_left = ('81 01 06 01 %s %s 01 01 FF' % (str(self.pan_speed), str(self.tilt_speed)))
      # self.pan_up_right = ('81 01 06 01 %s %s 02 01 FF' % (str(self.pan_speed), str(self.tilt_speed)))
      # self.pan_down_left = ('81 01 06 01 %s %s 01 02 FF' % (str(self.pan_speed), str(self.tilt_speed)))
      # self.pan_down_right = ('81 01 06 01 %s %s 02 02 FF' % (str(self.pan_speed), str(self.tilt_speed)))
      # self.pan_stop = ('81 01 06 01 %s %s 03 03 FF' % (str(self.pan_speed), str(self.tilt_speed)))
      
      
      self.pan_up = ('81 01 06 01 %s %s 03 01 FF')# % (str(self.pan_speed), str(self.tilt_speed)))
      self.pan_down = ('81 01 06 01 %s %s 03 02 FF')# % (str(self.pan_speed), str(self.tilt_speed)))
      self.pan_left = ('81 01 06 01 %s %s 01 03 FF')# % (str(self.pan_speed), str(self.tilt_speed)))
      self.pan_right = ('81 01 06 01 %s %s 02 03 FF') #% (str(self.pan_speed), str(self.tilt_speed)))
      self.pan_up_left = ('81 01 06 01 %s %s 01 01 FF') #% (str(self.pan_speed), str(self.tilt_speed)))
      self.pan_up_right = ('81 01 06 01 %s %s 02 01 FF') #% (str(self.pan_speed), str(self.tilt_speed)))
      self.pan_down_left = ('81 01 06 01 %s %s 01 02 FF') #% (str(self.pan_speed), str(self.tilt_speed)))
      self.pan_down_right = ('81 01 06 01 %s %s 02 02 FF') #% (str(self.pan_speed), str(self.tilt_speed)))
      self.pan_stop = ('81 01 06 01 %s %s 03 03 FF') #% (str(self.pan_speed), str(self.tilt_speed)))

      self.pan_home = '81 01 06 04 FF'
      self.pan_reset = '81 01 06 05 FF'
      self.zoom_direct = '81 01 04 47 0p 0q 0r 0s FF' # pqrs: Zoom Position
      self.zoom_focus_direct = '81 01 04 47 0p 0q 0r 0s 0t 0u 0v 0w FF' # pqrs: Zoom Position  tuvw: Focus Position

      self.inquiry_lens_control = '81 09 7E 7E 00 FF'
      self.inquiry_camera_control = '81 09 7E 7E 01 FF'

      self.focus_stop = '81 01 04 08 00 FF'
      self.focus_far = '81 01 04 08 02 FF'
      self.focus_near = '81 01 04 08 03 FF'
      self.focus_far_variable = '81 01 04 08 2p FF'.replace('p', '7') # 0 low to 7 high
      self.focus_near_variable = '81 01 04 08 3p FF'.replace('p', '7') # 0 low to 7 high
      self.focus_direct = '81 01 04 48 0p 0q 0r 0s FF' 
      self.focus_auto = '81 01 04 38 02 FF'
      self.focus_manual = '81 01 04 38 03 FF'
      self.focus_infinity = '81 01 04 18 02 FF'

   def sequence_number_reset(self):
      reset_sequence_number_message = bytearray.fromhex('02 00 00 01 00 00 00 01 01')
      self.socket.sendto(reset_sequence_number_message,(self.camera_ip, self.camera_port))
      self.sequence_number = 1
      return self.sequence_number

   def send_message(self, message_string): 
      try:
          payload_type = bytearray.fromhex('01 00')
          payload = bytearray.fromhex(message_string)
          payload_length = len(payload).to_bytes(2, 'big')
          message = payload_type + payload_length + self.sequence_number.to_bytes(4, 'big') + payload
          self.sequence_number += 1
          self.socket.sendto(message, (self.camera_ip, self.camera_port))
          return True
      except:
          return False

   def recall_memory(self, memory_number):
      self.send_message(self.information_display_off) # otherwise we see a message on the camera output
      sleep(0.25)
      message_string = self.memory_recall.replace('p', str(memory_number))
      message = self.send_message(message_string)
      sleep(1)
      self.send_message(self.information_display_off) # to make sure it doesn't display "done"
      return message

   def set_memory(self, memory_number):
      message_string = self.memory_set.replace('p', str(memory_number))
      message = self.send_message(message_string)
      return message



USERS = set()

async def register(websocket):
    USERS.add(websocket)

async def unregister(websocket):
    USERS.remove(websocket)

async def hello(websocket, path):
   await register(websocket)
   try:
        async for message in websocket:
            command = json.loads(message)
            if command["type"] == "recall":
                print("Camera Recall %s" % command["value"])
                camera.recall_memory(command["value"])
            elif command["type"] == "set":
                print("Camera Set %s" % command["value"])
                camera.set_memory(command["value"])
            elif command["type"] == "fixed":
               print(command)
               visca_command = getattr(camera,command["command"])
               print(visca_command)
               camera.send_message(visca_command)
            elif command["type"] == "switcher":
               print(command)
               switcher.input(command["input"])
            else:
               print(command)
               visca_command = getattr(camera,command["type"]) % (str(command["pan_speed"]).zfill(2), str(command["tilt_speed"]).zfill(2))
               print(visca_command)
               camera.send_message(visca_command)
               #print(command)
               
   finally:
         await unregister(websocket)

      
camera = ViscaCamera('192.168.1.28',1259)
switcher = AtemSwitcher('192.168.1.240')
def main():

   #camera = ViscaCamera('192.168.1.28',1259)
   print ("Starting Web socket server")
   start_server = websockets.serve(hello, "192.168.1.106", 8765)

   asyncio.get_event_loop().run_until_complete(start_server)
   asyncio.get_event_loop().run_forever()


main()

