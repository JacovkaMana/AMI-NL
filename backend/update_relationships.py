from core.config import init_neo4j
from neomodel import db
from models.character import Character
from models.user import User


def update_character_relationships():
    # Initialize the Neo4j connection
    init_neo4j()

    # Remove all existing OWNED_BY relationships
    db.cypher_query("MATCH (u:User)<-[r:OWNED_BY]-(c:Character) DELETE r")
    db.cypher_query("MATCH (u:User)-[r:OWNED_BY]->(c:Character) DELETE r")

    # Find the user with username "Fane"
    fane_user = User.nodes.first_or_none(email="fane@admin.ru")
    if not fane_user:
        print("User 'Fane' not found.")
        return

    # Query to find all characters
    query = "MATCH (c:Character) RETURN c"
    results, _ = db.cypher_query(query)

    for row in results:
        character = Character.inflate(row[0])
        print(f"Connecting Character {character.uid} to User {fane_user.uid}")

        # Create the new relationship
        character.owner.connect(fane_user)

    print("All characters connected to user 'Fane' successfully.")


if __name__ == "__main__":
    update_character_relationships()
