[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)
[![Coverage-Status](https://coveralls.io/repos/github/nicka/coinboss/badge.svg?branch=master)](https://coveralls.io/github/nicka/coinboss?branch=master)
[![Build-Status](https://travis-ci.org/nicka/coinboss.svg?branch=master)](https://travis-ci.org/nicka/coinboss)

<div align="center">
  <img src="https://user-images.githubusercontent.com/195404/27678009-e8f765d4-5cb3-11e7-934a-76309f796af3.png">
</div>

---

Automagically buy BTC, ETH or LTC on Coinbase, based on user defined thresholds.

>**Tradingbots:** Typically, bots perform tasks that are both simple and structurally repetitive, at a much higher rate than would be possible for a human alone.

# Architecture

![coinboss](https://user-images.githubusercontent.com/195404/27678017-ecb67dd6-5cb3-11e7-9439-cc01ff71f7b3.png)

# Prerequisites

For node module management Coinboss uses [Yarn](https://yarnpkg.com/) over NPM.

To install yarn globally on your machine please check [Installing Yarn](https://yarnpkg.com/en/docs/install#mac-tab).

After that you can install all service dependencies with:

```bash
yarn
```

# Quick Start

1. Setup project

>This is a convenience method to install a pre-made Serverless Service locally by downloading the Github repo and unzipping it. Services are listed below.

```bash
serverless install -u https://github.com/nicka/coinboss
```

2. Install development dependencies

```bash
yarn
```

3. Setup environment

```bash
cp .env.example .env.dev
```

4. Update configuration within `.env.dev`

5. Deploy your Coinboss

```bash
STAGE="dev" yarn run deploy
```

# How

![cloudwatch-dashboard](https://user-images.githubusercontent.com/195404/27678272-ea84e754-5cb4-11e7-957f-96d03029a2a9.png)

Coinboss is triggered based on CloudWatch alarms. The thresholds can be found within the projects [.env.example](.env.example).

# Test

For testing Coinboss uses [Jest](https://facebook.github.io/jest/), for more information please check their [documentation](https://facebook.github.io/jest/#getting-started).

>NOTE: To update Jest snapshots supply ` -- -u` to any of the test commands.

**Running the tests**

```bash
yarn run test
```

**Code coverage**

In order to inspect code coverage:

```bash
open coverage/lcov-report/index.html
```

# Simulate

Local API Gateway simulation.

```bash
STAGE="dev" yarn run serve
```

# Build

Create build artifacts.

```bash
STAGE="dev" yarn run build
```

# Deploy

Deploy build artifacts.

```bash
STAGE="dev" yarn run deploy
```

# Todo

- [ ] Increase test coverage
- [ ] Add support for percentage thresholds
- [ ] Add more currency alarms
