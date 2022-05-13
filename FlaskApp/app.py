from getpass import getpass
from mysql.connector import connect, Error
from flask import Flask, render_template, request, redirect, url_for, session
from flask_mysqldb import MySQL
from flask_cors import CORS, cross_origin
import MySQLdb.cursors
import re

GET_LIMIT = 20

app = Flask(__name__)
CORS(app)
# CORS(app, support_credentials=True)
cursor = None

def try_query(query):
    try:
        with connect(
            host="34.135.148.155",
            user="root",
            password="root",
            database="RecipEZ"
        ) as connection:
            with connection.cursor() as cursor:
                if query[0:3] == "GET":
                    query += " LIMIT " + GET_LIMIT
                print("trying query: " + query)
                cursor.execute(query)
                ret = cursor.fetchall()
                connection.commit()
    except Error as e:
        ret = e
    return str(ret)

def try_procedure(query):
    try:
        with connect(
            host="34.135.148.155",
            user="root",
            password="root",
            database="RecipEZ"
        ) as connection:
            with connection.cursor() as cursor:

                cursor.callproc(query)
                ret = [r.fetchall() for r in cursor.stored_results()]

                #df = pd.DataFrame(results, columns=[i[0] for i in results.description])
                print("RET: " + str(ret))
                connection.commit()
    except Error as e:
        print("FAILED")
        ret = e
        print(ret)
    return str(ret)

@app.route("/")
def main():
    ing_query = "SELECT * FROM Ingredient LIMIT 5"
    # return try_query(ing_query)
    return render_template("index.html")

def get_row_count(tableName):
    query = "SELECT COUNT(*) FROM" + tableName
    ret = try_query(query).split(',')
    print(ret)
    return ret[0][2:]

@app.route("/searchRecipe.html")
def searchRecipeHTML():
    return render_template("searchRecipe.html")

@app.route("/searchReview.html")
def searchReviewHTML():
    return render_template("searchReview.html")

@app.route("/newReview.html")
def newReviewHTML():
    return render_template("newReview.html")

@app.route("/oldReview.html")
def oldReviewHTML():
    return render_template("oldReview.html")

@app.route('/recipe/ingredient', methods = ['GET'])
def get_recipe_by_ingredient():
    ingredientName = request.args.get('ingredientName')
    if ingredientName is None:
        return "GET request malformed. Must include ingredientName"
    query = """
            SELECT rec.name
	        FROM Contains c JOIN Recipe rec ON c.recipeID = rec.recipeID JOIN Ingredient ing ON c.ingredientID = ing.ingredientID
	        WHERE ing.name LIKE '%""" + ingredientName + """%'
            LIMIT 20
            """
    return try_query(query)

@app.route('/recipe/user', methods = ['GET'])
def get_recipe_by_user():
    userID = request.args.get('userID')
    if userID is None:
        return "GET request malformed. Must include userID"
    query = """
            SELECT rat.ratingID, rec.name, rat.score, rat.review
	        FROM Rating rat NATURAL JOIN Recipe rec
	        WHERE userID = """ + str(userID)
    return try_query(query)

@app.route('/recipe/all', methods = ['GET'])
def get_recipe_all():
    query = """
            SELECT recipeID, name
	        FROM Recipe

            LIMIT 40"""
    print("THIS IS MY QUERY")
    return try_query(query)

@app.route('/review/new', methods = ['POST'])
def create_new_review():
    ratingID = "NULL" # Set to NULL to autogenerate a new ratingID
    recipeID = request.args.get('recipeID')
    score = request.args.get('score')
    review = request.args.get('review')
    review = "'" + review + "'"
    userID = request.args.get('userID')
    if None in [recipeID, score, review, userID]:
        return "POST request malformed. Must include recipeID, score, review, userID"
    query = """INSERT INTO Rating (ratingID, recipeID, score, review, userID)
            VALUES (""" + ratingID + ", " + recipeID + "," + score + ", " + review + ", " + userID + ")"
    return try_query(query)

@app.route('/review/delete', methods = ['DELETE'])
def delete_review():
    ratingID = request.args.get('ratingID')
    if ratingID is None:
        return "DELETE request malformed. Must include ratingID"
    query = "DELETE FROM Rating WHERE ratingID = " + ratingID
    return try_query(query)

@app.route('/review/update', methods = ['PUT'])
def update_review():
    ratingID = request.args.get('ratingID')
    if ratingID is None:
        return "UPDATE queries must contain a ratingID."
    score = request.args.get('score')
    review = request.args.get('review')
    review = review

    firstFlag = False
    fragment = " SET "
    if score is not None:
        fragment += "score = " + score
        firstFlag = True
    if review is not None:
        if firstFlag == False:
            firstFlag = True
        else:
            fragment += ", "
        fragment += "review = " + review
    if firstFlag == False:
        return "UPDATE queries must contain at least 1 value to update."
    query = "UPDATE Rating" + fragment + " WHERE ratingID = " + ratingID
    return try_query(query)

@app.route('/review/get', methods = ['GET'])
def get_review():
    ratingID = request.args.get('ratingID')
    userID = request.args.get('userID')
    score = request.args.get('score')
    recipeID = request.args.get('recipeID')

    firstFlag = False
    cond = " WHERE "
    # Should these search criteria be mutually exclusive?
    # For the time being, just chaining them together with ANDs.
    # If we change to mutual exclusivity, just change control flow to elif.
    if ratingID is not None:
        cond += "ratingID = " + ratingID
        firstFlag = True
    if userID is not None:
        if firstFlag == False:
            firstFlag = True
        else:
            cond += " AND "
        cond += "userID = " + userID
    if score is not None:
        if firstFlag == False:
            firstFlag = True
        else:
            cond += " AND "
        cond += "score = " + score
    if recipeID is not None:
        if firstFlag == False:
            firstFlag = True
        else:
            cond += " AND "
        cond += "recipeID = " + recipeID

    query = "SELECT * FROM Rating"
    if firstFlag == False:
        return try_query(query)
    else:
        print(query + cond)
        return try_query(query + cond)
@app.route('/rating/popular', methods=['GET'])
def get_avgs():
    query = """
            SELECT rec.name, ROUND(AVG(rat.score), 2) AS AverageRating
            FROM Recipe rec NATURAL JOIN Rating rat JOIN User u on rat.userID = u.userID
            WHERE u.userID IN (SELECT u1.userID
	                            FROM Rating rat1 NATURAL JOIN User u1
	                            GROUP BY u1.userID
	                            HAVING COUNT(rat1.ratingID) > 1)
            GROUP BY recipeID
            ORDER BY AverageRating DESC
            LIMIT 20
            """
    return try_query(query)

@app.route('/recipe/easy', methods=['GET'])
def get_easy_recipes():
    query = """
            SELECT rec.name, fd.minutesToPrepare, fd.numOfSteps, sub.numIngredients
            FROM Recipe rec NATURAL JOIN FilterData fd JOIN (
	           SELECT recipeID, COUNT(ingredientID) AS numIngredients
	           FROM Contains
	           GROUP BY recipeID
            ) as sub ON rec.recipeID = sub.recipeID
            WHERE fd.minutesToPrepare < 30 AND fd.numOfSteps < 10 AND sub.numIngredients < 10
            LIMIT 20
            """
    return try_query(query)

@app.route('/recipe/avgratings', methods=['GET'])
def get_avg_ratings_procedure():
    return try_procedure("AvgRatings")




# @app.after_request
# def after_request(response):
#   response.headers.add('Access-Control-Allow-Origin', '*')
#   response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
#   response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
#   return response




# @app.route('/recipe/avgratings', methods=['GET'])
# def get_avg_ratings():
#     query = """
#         SELECT rec.name, AVG(rat.score)
#         FROM Rating rat NATURAL JOIN Recipe rec JOIN User u ON rat.userID = u.userID
#         GROUP BY rec.name
#         LIMIT 20;
#             """
#     return try_query(query)




if __name__ == "__main__":
    # app.run(host='0.0.0.0', port=8080)
    app.run()
