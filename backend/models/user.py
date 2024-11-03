from neomodel import StructuredNode, StringProperty, UniqueIdProperty


class User(StructuredNode):
    uid = UniqueIdProperty()
    username = StringProperty(unique_index=True, required=True)
    email = StringProperty(unique_index=True, required=True)
    hashed_password = StringProperty(required=True)
