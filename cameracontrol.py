#!/usr/bin/python3

import socket
from time import sleep
from simple_websocket_server import WebSocketServer, WebSocket
import json
from threading import Thread
import PyATEMMax
from pprint import pprint

class AtemSwitcher(object):
    def __init__(self, atem_ip):
        print ("Attempting to connect to ATEM Switcher")
        self.switcher = PyATEMMax.ATEMMax()
        self.switcher.connect(atem_ip)
        self.switcher.waitForConnection()
        print ("Connected to ATEM Switcher")
    
    def input(self, video_in):
        self.switcher.setProgramInputVideoSource(0,video_in)
        sleep(.2)
        return {"message" : "video_input", "value" : str(video_in) }

    def get_input(self):
        try:
            return self.switcher.programInput[0].videoSource
        except:
            return "input0"

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
      self.memory_set = '81 01 04 3F 01 0%s FF' # p: Memory number (=0 to F)
      self.memory_recall = '81 01 04 3F 02 0%s FF' # p: Memory number (=0 to F)

    
      # Pan speed setting 0x01 (low speed) to 0x18
      # Tilt speed setting 0x01 (low speed) to 0x17
     
      self.pan_speed = '05'
      self.tilt_speed = '05'
      
      
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
      self.CAM_MemoryInq = ('81 09 04 3F FF')

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
      return  {"message" : "reset", "value" : self.sequence_number }

   def send_message(self, message_string): 
      try:
          payload_type = bytearray.fromhex('01 00')
          payload = bytearray.fromhex(message_string)
          payload_length = len(payload).to_bytes(2, 'big')
          message = payload_type + payload_length + self.sequence_number.to_bytes(4, 'big') + payload
          self.sequence_number += 1
          self.socket.sendto(message, (self.camera_ip, self.camera_port))
          return {"message" : "send_message", "value" : message_string }
      except:
          return  {"message" : "send_message", "value" : False }

   def recall_memory(self, memory_number):
      self.send_message(self.information_display_off) # otherwise we see a message on the camera output
      sleep(0.25)
      message_string = (self.memory_recall % (str(memory_number)))
      message = self.send_message(message_string)
      sleep(1)
      self.send_message(self.information_display_off) # to make sure it doesn't display "done"
      return  {"message" : "recall", "value" : memory_number }

   def set_memory(self, memory_number):
      message_string = (self.memory_set % (str(memory_number)))
      message = self.send_message(message_string)
      return  {"message" : "set", "value" : memory_number }


########SIMPLE-WEBSOCKETS################################
clients = []
SWITCHER = {"not_set": ""}
PRESET = {"not_set": ""}
MESSAGE = {"not_set": ""}

class ws_Server(WebSocket):

    def handle(self):
        global SWITCHER, PRESET, MESSAGE
        command = json.loads(self.data)
        try:
            
            if command["type"] == "recall":
                verboseprint("Camera Recall %s" % command["value"])
                PRESET = camera.recall_memory(command["value"])
                notify_state()
            elif command["type"] == "set":
                verboseprint("Camera Set %s" % command["value"])
                MESSAGE = camera.set_memory(command["value"])
                notify_state()
            elif command["type"] == "fixed":
               verboseprint(command)
               visca_command = getattr(camera,command["command"])
               verboseprint(visca_command)
               MESSAGE = camera.send_message(visca_command)
               notify_state()
            elif command["type"] == "switcher":
               verboseprint(command)
               SWITCHER = switcher.input(command["input"])
               notify_state()
            else:
               verboseprint(command)
               visca_command = getattr(camera,command["type"]) % (str(command["pan_speed"]).zfill(2), str(command["tilt_speed"]).zfill(2))
               verboseprint(visca_command)
               MESSAGE = camera.send_message(visca_command)
               notify_state()
               verboseprint(command)
        except Exception as e:
                print("Something Went Wrong: %s" % e)    
        
    def connected(self):
        global clearone_connected
        try:
            print(self.address, 'connected')
            clients.append(self)
            notify_state()
        except Exception as e:
                verboseprint("Something Went Wrong in connected: %s" % e)
                self.remove_me(self)

    def handle_close(self):
        global clearone_connected
        try:
            clients.remove(self)
            print(self.address, 'closed')
        except Exception as e:
                verboseprint("Something Went Wrong in handle_close: %s" % e)
                self.remove_me(self)
    
    def remove_me(self):
        try:
            print("Trying to remove client")
            clients.remove(self)
        except Exception as e:
            verboseprint("Couldn't remove client: %s" % e)

def notify_state():
    input = switcher.get_input()
    for client in clients:
        try:
            message = json.dumps({
                "message" : MESSAGE, 
                "switcher" : SWITCHER, 
                "preset" : PRESET,
                "input" : str(input)
                
                })
            client.send_message(message)
        except Exception as e:
            verboseprint("Something Went Wrong in handle_close: %s" % e)
               


def server_thread():
    server = WebSocketServer('', 8765, ws_Server)
    print ("Starting Web socket server")
    server.serve_forever()         

def switcher_state():
    print("Starting Switcher State Thread")
    while True:
        sleep(10)
        try:
            notify_state()
        except:
            pass

camera = ViscaCamera('192.168.1.28',1259)
switcher = AtemSwitcher('192.168.1.240')

verboseprint = lambda s: None

verboseprint = lambda s: pprint(s)
def main():

    print ("Starting Web socket server")
    ws_thread = Thread(target=server_thread)
    ws_thread.start()

    switcher_thread = Thread(target=switcher_state)
    switcher_thread.start()



main()

