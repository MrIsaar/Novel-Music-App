# Microsoft Azure Setup
The Music Tool application uses Microsoft Azure for the majority of its infrasturcutre. This includes web server and database hosting services. Before any of the specific services can be set up, a Microsfot Azure directory, subscrpition, and resource group must be created.

## Directory
Directories are the top-level organizational structure of Azure. After first creating an Azure account, you will automatically be assigned a "Default Directory." In most cases this will be all you need. Only create more directories if you are managing large-scale, independent projects. 
## Subscription
Subscriptions are used for managing payments for related Azure resources. If you are a student, confirm your student status at https://azure.microsoft.com/en-us/free/students/, then you will automatically be assigned a subscription called "Azure for Students" with $100 free credit per year.
## Resource Group
Resource groups are groups of related resources usually associated with a single project under a single subscription. Create a resource group with a logical name ("Music-ToolResourceGroup") associated with a logical location ("Central US"). The location is not extremely important since you can choose where to base individual resources within the group.
## Adding Users
Users can be given access to specific resources or resource groups and the permissions of each user can be very exactly defined. For our purposes, it is simplest to add all team members to the resource group. 
To add users to the group:
1. Go to the settings for the resource group
2. Go to the Access Control (IAM) tab
3. Click "+ Add" -> Add Role Assignment
4. Select the role to assign. For our team each member is given the "Contributer" role which gives full access to all resources except the ability to assign roles.
5. Under "Assign Access To:" select "User, group, or service principal"
6. Click "Select Members"
7. Enter the email addresses of each team member to invite.

# App Service Setup
Once all of the above resources and settings have been configured, you can create an App Service resource to actually host the web application. This can be created through the Azure web portal, but it is less prone to error to create the service through the Visual Studio "Publish" feature.
1. Open the application to be deployed in Visual Studio.
2. Go to Build -> Publish
3. Select "Create a new publish profile"
4. For "Target", select "Azure".
5. For "Specific Target", select "Azure App Service (Windows)." 
    - The choice between Windows and Linux is mostly arbitrary. It will affect the actual server software running on Azure's machines, but we will not have to directly interact with it and the choice will not affect our workflow.
6. For "Subscription Name" select "Azure for Students" (or whatever subscription you want to use).
7. Under "App Service Instances" select the "+" icon to create a new instance.
    - If you already have the App Service set up, simply select the appropriate instance and click "Finish."
8. Fill in the settings for your new App Service
    1. Give it a logical name you can recognize it by.
    2. Assign it to the "Azure for Students" subscription.
    3. Assign it to the "Music-ToolResourceGroup" resource group.
    4. Create a new hosting plan. For development purposes, select a free server such as "Central US, F1".
9. Click "Create."
10. Select your new App Service instance and click "Finish."

# Database Setup
Coming Soon...
