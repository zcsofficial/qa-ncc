import pymongo

# MongoDB connection URI
mongo_uri = 'mongodb+srv://adnankstheredteamlabs:Adnan%4066202@cluster0.qrppz7h.mongodb.net/myDatabase?retryWrites=true&w=majority&appName=Cluster0'

# Connect to MongoDB
client = pymongo.MongoClient(mongo_uri)
db = client['myDatabase']  # Replace with your database name
cadets_collection = db['cadets']  # Replace with your collection name

# Sample cadet data
cadets_data = [
    {"cadetID": "C001", "name": "Ravi Kumar", "rank": "Lieutenant", "year": 2023},
    {"cadetID": "C002", "name": "Anjali Singh", "rank": "Captain", "year": 2022},
    {"cadetID": "C003", "name": "Rajesh Sharma", "rank": "Major", "year": 2021},
    {"cadetID": "C004", "name": "Pooja Verma", "rank": "Lieutenant", "year": 2023},
    {"cadetID": "C005", "name": "Amit Mehta", "rank": "Captain", "year": 2022},
    {"cadetID": "C006", "name": "Sneha Desai", "rank": "Major", "year": 2021},
    {"cadetID": "C007", "name": "Vikram Patel", "rank": "Lieutenant", "year": 2023},
    {"cadetID": "C008", "name": "Riya Jain", "rank": "Captain", "year": 2022},
    {"cadetID": "C009", "name": "Arjun Gupta", "rank": "Major", "year": 2021},
    {"cadetID": "C010", "name": "Neha Bansal", "rank": "Lieutenant", "year": 2023},
]

# Insert cadet data into the collection
try:
    result = cadets_collection.insert_many(cadets_data)
    print(f"Successfully added {len(result.inserted_ids)} cadets.")
except Exception as e:
    print(f"Error inserting cadet data: {e}")

# Close the connection
client.close()
