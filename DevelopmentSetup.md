# Development Environment Setup
### Local Development Environment
- Visual Studio 2022
- Git
- npm
- Node.js
### Cloud Tools
- GitHub account
- Microsoft Azure account

## Visual Studio 2022
Novel-Music-App uses .NET 6 as well as other features which are not natively supported by earlier versions of Visual Studio. It is possible to use other IDE / code editors if desired, but Visual Studio is recommended since it offers excellent integration with GitHub for version control and with Azure for deployment.
1. Go to https://visualstudio.microsoft.com/vs/ to download the installer.
2. When asked to choose workloads, select all of the following:
	- ASP.NET and Web Development
	- Azure Development
	- Node.js Development
	- Data Storage and Processing
3. If Visual Studio 2022 is already installed, or if you do not want to install all of the above features now, they can be installed later as needed.

## Git
Git is a source code version control tool that enables collaborative development of projects.
Download at https://git-scm.com/downloads and follow the instructions in the installer.

## Node.js
Node.js is required to run a development server on your local machine. It is not used once the app has been deployed to the Azure server.
Download at https://nodejs.org. Download the stable version 16.14.0.

## npm
Node Package Manager (npm) is installed along with Node.js. 

## GitHub
Create an account at https://github.com. Contact Isaac Gibson (GitHub user MrIsaar) for access to the repository.

## Microsoft Azure
Create an account at https://azure.microsoft.com/en-us/. Contact Jackson Dean for access to the project resources.

# Running the App Locally
These steps assume you have a machine set up as described above in "Development Environment Setup".
1. Open the Visual Studio solution contained in the "MusicTool" folder of the repository.
2. Simply press the green run button labeled "MusicTool" at the top of Visual Studio. This will start the development server and open the landing page of the application in your default browser.
	- It's possible that the server fails to start on the very first run. Simply re-run the application a few times before debugging other options.
3. You're done!
	- Any edits made to JavaScript files while the application is running will be applied as soon as they are saved. The web page will automatically refresh to apply the changes.
	- Any edits made to C# files while the application is running will be applied when the server restarts **or** when you press the "Hot Reload" button in Visual Studio. Visual Studio can also be configured to automatically Hot Reload when files are saved.

# Publishing to Azure App Service
The Music Tool is hosted on Azure App Service. Once you have be added to the Resource Group on Azure, you will be able to publish directly from Visual Studio.
1. Confirm that you are on the production branch of the repository, all tests have been run, and the application compiles without errors.
2. Access the publish window from Build -> Publish MusicTool or by right-clicking on the project in the solution explorer and selecting Publish.
3. Set up a publish profile. This only needs to be done once.
    1. Select Add a publish profile.
    2. Select Azure as the target.
    3. Select Azure App Service (Windows) as the specific target.
    4. Select Azure for Students as the Subscription Name
    5. Select Music-Tool under App Service instances and click Next.
    6. Select Publish and click Finish.
4. Click Publish. Visual Studio will automatically create an optimized production build and deploy it to the Azure server. If it is published successfully, the new app will be opened in your default browser.
