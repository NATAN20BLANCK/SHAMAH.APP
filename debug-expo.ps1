Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
$env:EXPO_DEBUG=1
npx expo start --web --port 8083 --no-dev --minify
