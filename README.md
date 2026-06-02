# NecroClock

A simple application for tracking worked hours.

## Description

NecroClock was created to simplify the process of registering and consolidating worked hours across multiple demands. The application focuses on speed, simplicity, and practicality for daily use.

## Features

### Demand Management

* Create new demands
* Edit existing demands
* Delete demands
* Optional demand description

### Time Tracking

* Quickly add 1 hour to a demand
* Quickly remove 1 hour from a demand
* Manually adjust worked hours
* Automatic consolidation of hours

### Weekly Organization

* Demands are grouped by week
* Weeks are organized from Saturday to Sunday
* Easy visualization of worked hours per period

### Utilities

Copy demand information in the following format:

```text
{DemandNumber} - {Description}
```

Copy consolidated hours in the following format:

```text
{DemandNumber} - {Hours}
{DemandNumber} - {Hours}
```

## Technologies

* Angular
* PrimeNG
* ASP.NET Core
* Docker
* MariaDB / MySQL

## Installation

```bash
git clone https://github.com/NecroHome/NecroClock.Frontend.git
cd NecroClock.Frontend
npm install
ng serve
```

The application will be available at:

```text
http://localhost:4200
```

or using Docker

```bash
git clone https://github.com/NecroHome/NecroClock.Frontend.git
cd NecroClock.Frontend
docker compose up -d --build
```

The application will be available at:

```text
http://{IP from here docker is runing}:6005
```

## Changelog

### V1.0.1
* Search Feature: Demandas can now be search by numero or descricao.

### v1.0.0
* Initial release
