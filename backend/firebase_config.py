
import os
import pyrebase
import json

firebaseConfig = {
  "apiKey": os.getenv("APIKEY"),
  "authDomain": os.getenv("AUTHDOMAIN"),
  "projectId": os.getenv("PROJECTID"),
  "storageBucket": os.getenv("STORAGEBUCKET"),
  "messagingSenderId": os.getenv("MESSAGINGSENDERID"),
  "appId": os.getenv("APPID"),
  "measurementId": os.getenv("MEASUREMENTID"),
  "serviceAccount": json.loads(os.environ["SERVICEACCOUNT"]),
  "databaseURL": os.getenv("DATABASEURL"),
}


firebase = pyrebase.initialize_app(firebaseConfig)
storage = firebase.storage()
