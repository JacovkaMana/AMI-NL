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
If you need to create files, write bash commands to create them and then code in them


Rechek if all the functionality from @project_functionality.md and @project_technologies.md are met

Rechek if the code works and all dependencies and project structure is correct

Fix any global css problems
```



```
Edit code in @frontend folder according to @project_functionality.md and @project_technologies.md 


Create login/register page/pages that could be routed from landing page according to  @project_functionality.md 

Use styles and design from @project_designdoc.md 

Write in already created files or create new files if needed
If you need to create files, write bash commands to create them and then code in them


Rechek if all the functionality from @project_functionality.md and @project_technologies.md are met

Rechek if the code works and all dependencies and project structure is correct

Fix any global css problems
```


```
Edit code in @frontend folder according to @project_functionality.md and @project_technologies.md 


Create login/register page/pages that could be routed from landing page according to  @project_functionality.md 

Use styles and design from @project_designdoc.md 

Write in already created files or create new files if needed
If you need to create files, write bash commands to create them and then code in them


Rechek if all the functionality from @project_functionality.md and @project_technologies.md are met

Rechek if the code works and all dependencies and project structure is correct

Fix any global css problems
```


```
Edit code in @frontend folder according to @project_functionality.md and @project_technologies.md 


Handle css storing and routing in best-practice

Note that project pages and components are stored in frontend/src/
Stylize login/register models in frontend

Use styles and design from @project_designdoc.md 

Write in already created files or create new files if needed
If you need to create files, write bash commands to create them and then code in them


Rechek if all the functionality from @project_functionality.md and @project_technologies.md are met
Rechek if the code works and all dependencies and project structure is correct

Fix any global css problems
```




```
Edit code in  nd folder according to  ionality.md and  

Note that project pages and components are stored in frontend/src/

Stylize Character creation page as a dnd character creation sheet


Use styles and design from   and use Tailwind

Write in already created files or create new files if needed

If you need to create files, write bash commands to create them and then code in them

Rechek if all the functionality from  functionality.md and   are met

Rechek if the code works and all dependencies and project structure is correct

Fix any global css problems
```


```
Edit and Stylize Character creation page at  as a dnd character creation sheet

Use   for reference style and use Tailwind



Here is character creation sheet reference:  
```


Edit  according to  












Sprint 2:


Can you make this page @character-creation.js  look more like a dnd creation page and more in-style with landing page? 

Here is the whole frontend folder:  @frontend 
Here is src folder with pages and else: @src 
Here is the reference: @ref.png 
Prefer using Tailwind

Use only global css, as stated in Next





Now add to this a textfield that user would input his character description (like appearence and everything else)

Then make character creation form more vertical and move it to the left, so that on the right can be a picture of the same size as the form (like a character preview)




Now please edit colors and fonts on landing page @index.js  according to character creation page @character-creation.js  , i really like the colors there 

Also can you add the day/night version to all pages?







View my @frontend folder

Edit my login and registration for my frontend pages in @src  folder to use my api:


login: http://localhost:8000/api/auth/login
register: http://localhost:8000/api/auth/register
me: http://localhost:8000/api/auth/me


Also fix the login/register modals according to our new night/day themes

And create an Account status on the page with a logout button





My modals are not very good for a night theme and don't match overall styles (text colors, overall colors) in @src 

Please make them more in-style, remove screen brightening when opening modals

Scan @index.js and @character-creation.js to see how we done styling in there 

Prefer Tailwind 
Use Global css






Sprint 3:

```
Here's the endpoint for creating a Character on our backend:

http://localhost:8000/api/characters/

And the body example of this endpoint:
{
  "name": "string",
  "race": "Dragonborn",
  "alignment": "Unaligned",
  "size": "Tiny",
  "description": "string",
  "background": "string",
  "strength": 0,
  "dexterity": 0,
  "constitution": 0,
  "intelligence": 0,
  "wisdom": 0,
  "charisma": 0,
  "armor_class": 0,
  "initiative": 0,
  "speed": 0,
  "hit_points": 0,
  "temp_hit_points": 0,
  "hit_dice": "string",
  "saving_throws": {
    "additionalProp1": true,
    "additionalProp2": true,
    "additionalProp3": true
  },
  "skills": {
    "additionalProp1": true,
    "additionalProp2": true,
    "additionalProp3": true
  },
  "character_class": "Barbarian",
  "subclass": "string"
}


Let's add this to our @character-creation.js form in @frontend folder and also adjust form a bit for it to include everything that's not default for a 1-lvl character
```


```
Now let's fix our user flow a bit in my @frontend folder
Pages are in @src folder

I shouldn't need to Login every time i reload the page, it should remember me
After Login or Register on the same page i should view my characters, here is the endpoint: http://localhost:8000/api/characters/me
Then when viewing my characters i should be able to create a new one, and then be redirected to the character creation page
On every page there should be a button to go back to the landing page and a logout button

Please use the same styles that's already there in @character-creation.js and @index.js 
This project is using Next
Prefer Tailwind 
Use global CSS
Recheck all imports
```


```
Please make all the text the same color in night mode on this page @character-creation.js 

Right now Abilities like Athletics and Arcana are green, but they should be the same color as other text 

Also remove bold fonts
```


```
@backend 

Let's add some more logic in @image_generation.py , we will make another request to generate a better prompt for diffusion model
```