$ErrorActionPreference = 'Stop'

# Login
$body = @{ email='admin@taller.com'; password='admin123' } | ConvertTo-Json
$login = Invoke-RestMethod -Uri 'http://localhost:8000/api/auth/login' -Method POST -Body $body -ContentType 'application/json'
Write-Output '---LOGIN---'
$login | ConvertTo-Json -Depth 5

$token = ''
if ($login.data -and $login.data.token) { $token = $login.data.token } elseif ($login.token) { $token = $login.token }
Write-Output "TOKEN: $token"

# Create client
$clientBody = @{ nombre='Cliente Prueba'; email='cliente.prueba@example.com'; telefono='5551234567'; direccion='Calle Test 1' } | ConvertTo-Json
$client = Invoke-RestMethod -Uri 'http://localhost:8000/api/clientes' -Method POST -Body $clientBody -ContentType 'application/json' -Headers @{ Authorization = "Bearer $token" }
Write-Output '---CLIENT---'
$client | ConvertTo-Json -Depth 5

# Create automovil
$idcliente = $null
if ($client.data -and $client.data.id_cliente) { $idcliente = $client.data.id_cliente } elseif ($client.data -and $client.data.id) { $idcliente = $client.data.id }
Write-Output "ID_CLIENTE: $idcliente"
$autoBody = @{ marca='Toyota'; modelo='Corolla'; anio=2020; color='Blanco'; placas='ABC1234'; numero_serie='SN123456789'; id_cliente=[int]$idcliente } | ConvertTo-Json
$auto = Invoke-RestMethod -Uri 'http://localhost:8000/api/automoviles' -Method POST -Body $autoBody -ContentType 'application/json' -Headers @{ Authorization = "Bearer $token" }
Write-Output '---AUTOMOVIL---'
$auto | ConvertTo-Json -Depth 5
