# done using Composer in Cursor with gpt-4o-mini

# Sprint 1 


## backend api

```
read @project_technologies.md 

create a folder named backend and create all files and folder in it necessary to write scalable backend for this application

for models don't create anything, just a models folder and init

create subfolders if you think it is needed to write fastapi backend
do not write code, just create the files
```

```
Write models in @models  , using @project_database.md  and @project_technologies.md 
Create necessary files in model folder and write script before code
```

```
Write code in all already created files in folder @models 
Use needed libraries from @project_technologies.md  when working with classes and use all models  from @project_database.md 

Write all Enums from @project_database.md  in enums.py and use them wherever they are needed using import

Re-check if you wrote code for all models in @project_database.md 

Fix all relationships when needed


Delete all existing code and write from zero
```

```
Write code in all already created files in folders  @schemas  and @services  according to  @project_functionality.md
Use needed libraries from @project_technologies.md  when working with classes and use all needed files in nearby folders

Write all Enums from @project_database.md  in enums.py and use them wherever they are needed using import

Re-check if you wrote code for all functionality from @project_functionality.md

Fix all relationships when needed 

Create needed files as you go
Delete all existing code and write from zero 
```

```
Write code in all folder @api  according to  @project_functionality.md
Use needed libraries from @project_technologies.md  when working with classes and use all needed files in nearby folders

Use @services and @schemas and fix them if you need

Re-check if you wrote code for all functionality from @project_functionality.md

Fix all relationships when needed 

Create needed files when you need
Delete all existing code and write from zero 
```

```
Finally write code in @main.py  to start our fastapi backend

Create toml file for fastapi backed

Rechek all @app to see if all libraries used are included in Poetry toml file and update them

After that create a Dockerfile using poetry and a docker-compose.yml to start our fastapi backend

Create needed files as you go 
```

## backend database

```
read @project_technologies.md 

create a folder named database in project root and create docker-compose.yml and .env for needed technologies
synchronize .env and docker-compose.yml with all needed parameters

Create needed files and folders as you go 
```