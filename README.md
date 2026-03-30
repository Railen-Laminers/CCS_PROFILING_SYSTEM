CCS_PROFILING_SYSTEM

Backend
- npm install
- Create .env file then copy the code from .env.example
- Run "npm run seed" to populate the database
- Run "npm run dev" to run the backend

Frontend
- npm install
- "npm run dev" to run the frontend


Colors

HEX: #F47A20
HEX: #F68B3C
HEX: #F9A86C

git fetch --all; git branch -r | ForEach-Object {
    $branch = $_.Trim()
    if ($branch -notmatch '->') {
        $local = $branch -replace 'origin/', ''
        if (-not (git branch --list $local)) {
            git branch --track $local $branch | Out-Null
        }
        git checkout $local
        git pull
    }
}