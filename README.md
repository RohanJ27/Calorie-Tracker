Welcome to RecipeFit - the all-in-one Recipe app where you can create, search for, and socialize based off of your dietary needs!

If you have a limited list of ingredients at home, a peanut allergy that restricts food choices, or just want to keep track of your healthy eating RecipeFit provides a solution and much more.

Heres how you can run our app locally:

We have to set up the .env file in the backend to consist of our own MONGO_URI and API Keys to allow for the backend to fully function. If you go to the backend and check out .env.example file, we can see that we need MONGO_URI, EDAMAME API keys, and GOOGLE CLOUD CONSOLE Ids. Lets get these set up.

Here is what your backend/.env file should look like:

```
MONGO_URI=your mongo_uri

JWT_SECRET=your_jwt_secret_here

EDAMAM_APP_ID=your_edamam_app_id

EDAMAM_APP_KEY=your_edamam_app_key

GOOGLE_CLIENT_ID=your_google_client_id

GOOGLE_CLIENT_SECRET=your_google_client_secret

PORT=5000

FRONTEND_URL=http://localhost:5173
```

STEPS TO RUN THE PROJECT

1. run git clone https://github.com/RohanJ27/RecipeFit.git in your terminal

2. cd into the repository and then cd in frontend and run npm install

3. cd into the backend and run npm install

4. Create a MongoDB Atlast account
   Go to https://account.mongodb.com/account/register

- Once you create an account click create cluster
- Once you attempt to make your cluster make sure to whitelist all IP's or set this IP as allowed in the Network Access Tab: 0.0.0.0/0
- Next create a admin database user by creating a username and password of your choice (Make sure to remember!)
- Make sure to copy the Mongo_URI that is given and replace your db_password with the password you just created
- Add the Mongo URI to your dot env file naming it exactly MONGO_URI

![Alt Text](https://i.sstatic.net/ITq6c.png "Optional Tooltip")

5. Create an Edamam API account

- Edamam is the API that we use to search for recipes and returns the recipes back in JSON format. We can search for recipes with filters of ingredients, dietary restrictions, and macro goals!

Here is how to sign up for the Edamam API

- Go to https://www.edamam.com/
- Make sure when signing up to choose Enterprise Basic under the Recipe Search API (you should not have to enter your credit card details)

- When signed in, go to your Dashboard and click Applications
- Under RecipeSearch API click view

![Alt Text](https://cms-assets.tutsplus.com/cdn-cgi/image/width=630/uploads/users/321/posts/41545/image-upload/dashboard.JPG "Optional Tooltip")

There you will see your Application ID and Application Keys
Put your application id into EDAMAM_APP_ID and your application key into EDAMAM_APP_KEY in your .env file

6. Create Google Console Account
   Go to https://console.cloud.google.com/welcome/new

- Sign in with a google account of your choice
- Once logged in create a new project and name it whatever you want
- Next we have to create the consent screen for Google Auth
- Click OAuth Consent Screen on the left sidebar
- Make sure to make the user type external and click create
- Once you click create type in the App Name and the email you want to send updates to
- Skip everything on the screen and click save and continue
- Once you see the public app button click publish app to shift the status from Testing to Production and your app is now live

Now we have to create our client web ID

- On the left sidebar click credentials and at the top click create credentials and select OAUTH ID
- Make the application type is a web application

![Alt Text](https://blog.logrocket.com/wp-content/uploads/2022/08/img6-Steps-to-create-OAuth-client-ID.png "Optional Tooltip")

Now here is the important part

- Scroll down to Authorized Javascript Origins and make the URL: http://localhost:5173
- Make the Authorized Redirect URL to be: http://localhost:5000/api/auth/google/callback

On the right side you can see your Client ID and Client Secret which you will promptly put in your .env file

7.  You JWT_SECRET can be anything you want (basically a secret code)

Now you have all your Unique Ids and Keys to run the app locally!

8.  To run the app locally

To start the frontend:

```
cd frontend
```

```
npm run dev
```

To start the backend:

```
cd backend
```

```
node index.js
```

Now the app is running locally!
