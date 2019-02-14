# stumblefunk-accreditation
###PHP application for managing ticket allocations 
#### We get allocated x tickets when we run a venue/stage at a festival, this app helps us mange our allocation and also collects the details for each ticketholder that we need

* Docker container takes 4x evironment variables for MySQL config: `DB_HOST`, `DB_NAME`, `DB_USER` & `DB_PASS`

* Admin login is via `DB_PASS`

* Admin users can create 'groups', each group has a quota of adults/kids/vehicles assigned - Group has a unqiue access code generated

* Admin users can see overall ticket consumption, and lists of allocated tickets and vehicle passes

* When group user logs in with their details, they are able to assign contact details to each of their allocated tickets and vehicle passes
