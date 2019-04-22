#Progressive webapp powered with GraphQL on Docker
This project has 2 ways to run it:
* Standalone
* Dockerized

##Standalone
To run this project standalone, you will need to install couchdb on your own and load the data manually.

Next you will need to install node v8.1x

Update your environment to include the path to couchdb using powershell:
```powershell
$Env:COUCHDB_PATH = "http://127.0.0.1:5984"
```

Alternatively if you use Command Prompt:
```cmd
set COUCHDB_PATH=http://127.0.0.1:5984 
```

Now, you will need to start node:
```powershell
node server.js
```

##Dockerized
To run this project using docker, first you will need to install docker.

### Docker and getting it started
You will need docker installed to use this architecture configuration. Without docker, you will need to build the network and all the interconnections manually which this document does not include.
#### Installing Docker
[Download Docker](https://docs.docker.com/docker-for-windows/install/)

You will now need to enable Hyper-V by using this powershell script
```powershell
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All
```
Additionally you can follow this guide: https://docs.microsoft.com/en-us/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v

#### CDM specific issues/items to watch
Being that we are on a Windows Domain, we do need to watch out for a few issues that come up.

- Userland errors
    - This is caused by windows not allowing docker permission to assign ports. 
    - If this occurs, go into *Docker > Settings > Reset* and restarting the Hyper-V VM to resolve this issue. 
    - If the issue persists, restart your computer and got to *Docker > Settings > Shared Drives > Reset credentials* 

### Running the project in Docker
Open a Powershell or Command Prompt and run this command in the project directory:
```powershell
docker-compose up
```

That is it!