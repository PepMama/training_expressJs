# =========================
# Prompt du nom du module
# =========================
chcp 65001 | Out-Null

$moduleName = Read-Host "Nom du module à créer"

if ([string]::IsNullOrWhiteSpace($moduleName)) {
  Write-Error "Nom de module invalide."
  exit 1
}

$moduleName = $moduleName.Trim()
$folderName = $moduleName.ToLower()

# =========================
# Chemins
# =========================

$projectRoot = Get-Location
$modulesRoot = Join-Path $projectRoot "module"
$modulePath  = Join-Path $modulesRoot $folderName

$controllerFile = "$folderName.controller.js"
$modelFile      = "$folderName.model.js"
$routeFile      = "$folderName.route.js"

# =========================
# Utils
# =========================

function To-PascalCase([string]$s) {
  $s = [string]$s
  $clean = ($s -replace '[_\-]', ' ').Trim()

  if ([string]::IsNullOrWhiteSpace($clean)) {
    return ""
  }

  $parts = $clean -split '\s+' | Where-Object { $_ -ne '' }

  if ($parts.Count -eq 1) {
    $p = [string]$parts[0]
    if ($p.Length -le 1) { return $p.ToUpper() }
    return ($p.Substring(0,1).ToUpper() + $p.Substring(1))
  }

  return ($parts | ForEach-Object {
    $w = [string]$_
    if ($w.Length -le 1) { $w.ToUpper() }
    else { $w.Substring(0,1).ToUpper() + $w.Substring(1).ToLower() }
  }) -join ''
}

$pascalName = To-PascalCase $moduleName
$tableName  = $folderName

# =========================
# Checks
# =========================

if (-not (Test-Path $modulesRoot)) {
  Write-Error "Le dossier 'module' n'existe pas à la racine du projet."
  exit 1
}

if (Test-Path $modulePath) {
  Write-Error "Le module '$folderName' existe déjà."
  exit 1
}

# =========================
# Création
# =========================

New-Item -ItemType Directory -Path $modulePath | Out-Null

$controllerTemplate = @"
const ${pascalName} = require('./$modelFile');

exports.get = async () => {
    //TO DO
}
"@

$modelTemplate = @"
const { DataTypes } = require('sequelize');
const { bdd } = require('./../../helper/connexion.js');

const ${pascalName} = bdd.define('$pascalName', {

},{
    tableName: "$tableName"
});

module.exports = ${pascalName};
"@

$routeTemplate = @"
const express = require("express");
const router = express.Router();
const ${folderName}Controller = require('./$controllerFile');

module.exports = router;
"@

Set-Content (Join-Path $modulePath $controllerFile) $controllerTemplate -Encoding UTF8
Set-Content (Join-Path $modulePath $modelFile)      $modelTemplate      -Encoding UTF8
Set-Content (Join-Path $modulePath $routeFile)      $routeTemplate      -Encoding UTF8

Write-Host "✅ Module '$folderName' créé avec succès."