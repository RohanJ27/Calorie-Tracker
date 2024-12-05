# RecipeFit
Welcome to RecipeFit - the all-in-one Recipe app where you can create, search for, and socialize based on of your dietary needs!

If you have a limited list of ingredients at home, a peanut allergy that restricts food choices, or just want to keep track of your healthy eating, RecipeFit provides a solution and much more.

# Run the App Locally

You have to set up the ```.env``` file in the backend to include your own ```MONGO_URI``` and API Keys to allow the backend to function fully. If you go to the backend folder and check ```.env.example``` file, you can see that you need the following:
- ```MONGO_URI```
- EDAMAM API keys
- GOOGLE CLOUD CONSOLE IDs

Let's get these set up!

Here is what your ```backend/.env``` file should look like:

```
MONGO_URI=your_mongo_uri

JWT_SECRET=your_jwt_secret

EDAMAM_APP_ID=your_edamam_app_id

EDAMAM_APP_KEY=your_edamam_app_key

GOOGLE_CLIENT_ID=your_google_client_id

GOOGLE_CLIENT_SECRET=your_google_client_secret

PORT=5000

FRONTEND_URL=http://localhost:5173
```

## Getting Started

1. Run the following command in your terminal:
    ```
   git clone https://github.com/RohanJ27/RecipeFit.git
    ```
2. Navigate into the repository and then the ```frontend``` folder and run npm install:
   ```
   cd RecipeFit
   cd frontend
   npm install
   ```
3. Navigate into the ```backend``` folder and install the dependencies:
   ```
   cd ../backend
   npm install
   ```
## Set Up Database and Keys
### Create a MongoDB Atlas Account

4. Navigate to https://account.mongodb.com/account/register
- After you create an account, click "Create cluster".
- Make sure to whitelist all IP addresses by adding the following in the Network Access tab: ```0.0.0.0/0```.
- Create a admin database user by creating a username and password of your choice (Make sure to remember them!).
- Make sure to copy the connection string that is given and replace ```db_password``` with the password you just created.
- Add the connection string to your ```.env``` file as ```MONGO_URI``` .

![Alt Text](https://i.sstatic.net/ITq6c.png "Optional Tooltip")

5.  Your ```JWT_SECRET``` can be any string you of your choice (basically a secret code).

### Create an Edamam API account

6. Edamam is the API that used to search for recipes, and returns the recipes back in JSON format. You can search for recipes with filters of ingredients, dietary restrictions, and macro goals!

Here is how to sign up for the Edamam API

- Go to https://www.edamam.com/ and sign up for an account.
- Make sure when signing up to choose Enterprise Basic under the Recipe Search API (you should need to enter credit card details)

- Once signed in, go to your "Dashboard" and click "Applications".
- Click "View" next to "Recipe Search API".

![Alt Text](https://cms-assets.tutsplus.com/cdn-cgi/image/width=630/uploads/users/321/posts/41545/image-upload/dashboard.JPG "Optional Tooltip")

There, you should see your Application ID and Application Keys.
Put your Application ID into ```EDAMAM_APP_ID``` and your Application Key into ```EDAMAM_APP_KEY``` in your ```.env``` file.

### Create Google Console Account
7. Go to https://console.cloud.google.com/welcome/new.

- Sign in with a Google account of your choice.
- Once logged in create a new project and name it whatever you want.
- Next, you have to create the consent screen for Google Auth.
   - Click "OAuth Consent Screen" in the left sidebar
   - Select "External" as the user type and click "Create".
   - Enter the app name and an email address for updates.
   - Skip all remaining fields and click "Save and Continue".
   - Once you see the "Public App" button, click "Publish App" to shift the status from "Testing" to "Production".
Your app is now live!

Now we have to create our Client Web ID.

- In the left sidebar, click "Credentials" and then "Create Credentials" and select "OAuth Client ID".
- Choose "Web Application" as the application type.

![Alt Text](https://blog.logrocket.com/wp-content/uploads/2022/08/img6-Steps-to-create-OAuth-client-ID.png "Optional Tooltip")

- Scroll down to "Authorized Javascript Origins" and add the following URL: http://localhost:5173
- Make the Authorized Redirect URL:
  http://localhost:5000/api/auth/google/callback

On the right side, you should your "Client ID" and "Client Secret". Copy these and add them to your ```.env``` file.

Now you have all your Unique IDs and Keys to run the app locally!

### Run the App

8.  Run the following commands in terminal.

Start the frontend:

```
cd frontend
npm run dev
```

Start the backend:

```
cd backend
node index.js
```

Now the app is running locally!
