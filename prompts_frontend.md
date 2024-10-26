# done using Composer in Cursor with gpt-4o-mini

# Sprint 1 


## frontend api



```
Setup the frontend project according to @project_functionality.md  and @project_technologies.md 

Frontend folder will be in root and created by npx create, no need to create a separate folder
If i need to install something on my computer, write a bash script for it

Use React 18 for everything where it is needed
Rechek if all the packages work with each other and fix if needed
Delete all existing code and write from zero
```

# Create the frontend project using Next.js
npx create-next-app frontend

# Navigate into the frontend directory
cd frontend

# Install necessary packages
npm install react@18 react-dom@18 tailwindcss postcss autoprefixer

# Initialize Tailwind CSS
npx tailwindcss init -p


# Create necessary directories for components and styles
mkdir components styles

# Create a basic Tailwind CSS setup
echo "@tailwind base; @tailwind components; @tailwind utilities;" > styles/globals.css

# Make sure to check compatibility of installed packages
npm outdated



```
Write code in @frontend folder according to @project_functionality.md and @project_technologies.md 

Create pages according to  @project_functionality.md 

Come up with a default landing page in style from @project_designdoc.md, it should contain a login/register and then move us to other project functions

Use styles and design from @project_designdoc.md 

Write in already created files or create new files if needed

Rechek if all the functionality from @project_functionality.md and @project_technologies.md are met

Rechek if the code works and all dependencies and project structure is correct
```



```
Edit code in @frontend folder according to @project_functionality.md and @project_technologies.md 

Create pages according to  @project_functionality.md 

Come up with a default landing page in style from @project_designdoc.md, it should contain a login/register and then move us to other project functions

Use styles and design from @project_designdoc.md 

Write in already created files or create new files if needed

Rechek if all the functionality from @project_functionality.md and @project_technologies.md are met

Rechek if the code works and all dependencies and project structure is correct

Fix any global css problems
```