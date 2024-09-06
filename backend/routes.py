from app import app, db
from flask import request, jsonify
from models import Friend

# Get all friends
@app.route("/api/friends", methods=["GET"])
def get_friends():
    friends = Friend.query.all()
    result = [friend.to_json() for friend in friends]
    return jsonify(result)


#Create friend
@app.route("/api/friends", methods=["POST"])
def create_friend():
    try:
        data = request.json

        required_fields = ["name", "role", "description", "gender"]

        for field in required_fields:
            if field not in data or not data.get(field):
                return jsonify({"Error":f"Missing required field:{field}"}), 400

        name = data.get("name")
        role = data.get("role")
        description = data.get("description")
        gender = data.get("gender")

        #fetch avatar based on gender

        if gender == "male":
            img_url = f"https://api.dicebear.com/9.x/pixel-art/svg?seed={name}"
        elif gender == "female":
            img_url = f"https://api.dicebear.com/9.x/pixel-art/svg?seed={name}"
        else:
            img_url = None
        #img_url = data.get("")
        # img_url = f"https://avatar.iran.liara.run/public/girl?username={name}"
        new_friend = Friend(name = name, 
                            role = role, 
                            description = description,
                            gender = gender,
                            img_url = img_url)
        db.session.add(new_friend)  
        db.session.commit()
        return jsonify(new_friend.to_json()),201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg":str(e)}),500

#Delete friend
@app.route("/api/friends/<int:id>", methods=["DELETE"])
def delete_friend(id):
    try:
        friend = Friend.query.get(id)
        if friend is None:
            return jsonify({"Error": "Friend does not exist"}),404
        db.session.delete(friend)
        db.session.commit()
        return jsonify({"Msg":"Friend successfuly deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"Error":str(e)}), 500

#Update Friend
@app.route("/api/friends/<int:id>", methods=["PATCH"])
def update_friend(id):
    try:
        friend = Friend.query.get(id)
        if friend is None:
            return jsonify({"Error": "Friend does not exist"}),404
        
        data = request.json

        friend.name = data.get("name",friend.name)
        friend.role = data.get("role",friend.role)
        friend.description = data.get("description",friend.description)
        #friend.gender = data.get("gender",friend.gender)
        if friend.gender == "male":
            friend.img_url = f"https://api.dicebear.com/9.x/pixel-art/svg?seed={friend.name}"
        elif friend.gender == "female":
            friend.img_url = f"https://api.dicebear.com/9.x/pixel-art/svg?seed={friend.name}"
        else:
            friend.img_url = None
        
        db.session.commit()
        return jsonify(friend.to_json()),200

    except Exception as e:
        db.session.rollback()
        return jsonify({"Error":str(e)}), 500


