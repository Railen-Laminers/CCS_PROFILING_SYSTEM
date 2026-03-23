CCS_PROFILING_SYSTEM

Backend
- composer install
- Create .env file then copy the code in env.example then paste the code to the created .env file
- Run "php artisan migrate --seed" or "php artisan migrate:fresh --seed"
- Run "php artisan storage:link" for images to load
- Run "php artisan serve" to run

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