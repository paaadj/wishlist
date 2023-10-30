
import os
import pyrebase
import json

firebaseConfig = {
  "apiKey": os.getenv("apiKey"),
  "authDomain": os.getenv("authDomain"),
  "projectId": os.getenv("projectId"),
  "storageBucket": os.getenv("storageBucket"),
  "messagingSenderId": os.getenv("messagingSenderId"),
  "appId": os.getenv("appId"),
  "measurementId": os.getenv("measurementId"),
  "serviceAccount": json.loads(os.environ["serviceAccount"]),
  "databaseURL": os.getenv("databaseURL"),
}


firebase = pyrebase.initialize_app(firebaseConfig)
storage = firebase.storage()
