# stumblefunk.org.uk

Terraform for web infra. Builds main website (CloudFront+S3+ACM+Route53) as well as Accreditation system (Python/Lambda API/dynamoDB) + React frontend. 


##### We get allocated x tickets when we run a venue/stage at a festival, this app helps us mange our allocation and also collects the details for each ticketholder that we need.

* Admin users can create 'groups', each group has a quota of adults/kids/vehicles assigned - Group has a unqiue access code generated

* Admin users can see overall ticket consumption, and lists of allocated tickets and vehicle passes

* When group user logs in with their details, they are able to assign contact details to each of their allocated tickets and vehicle passes

## Building/deploying

All performed via GitHub actions on push. Dev env is automatic, prod requires manual approval. Dev env is removed after a prod deploy.

If you want to do it manually...

Frontend...
```
cd frontend
npm install
npm start
npm run build
```


Infra...
```
cd environments/dev
terragrunt plan
terragrunt apply
```