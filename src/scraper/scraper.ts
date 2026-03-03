import "dotenv/config";
import { Builder, WebDriver } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome.js";
import * as path from "path";
import { mouse, keyboard, Button, Key, sleep } from "@nut-tree-fork/nut-js";
import { spawn } from "child_process";

const CARGOSPOT_URL =
  "https://cargospot-web.cscloud.champ.aero/a7-prod-mt/?args={%22m%22:%22C%22}";

const USER = process.env.CARGOSPOT_USER ?? "";
const PASS = process.env.CARGOSPOT_PASS ?? "";

const POSITIONS = {
  CSV_COMMA: { x: 790, y: 284 },
  SQL_EDITOR: { x: 980, y: 838 },
  OK_BUTTON: { x: 1525, y: 940 },
};

const DOWNLOAD_DIR = path.resolve(process.cwd(), "downloads");

if (!USER || !PASS) {
  throw new Error("Faltan variables para Cargospot (USER/PASSWORD)");
}

function copyToClipboard(text: string) {
  return new Promise<void>((resolve, reject) => {
    const xclip = spawn("xclip", ["-selection", "clipboard"]);

    xclip.stdin.write(text);
    xclip.stdin.end();

    xclip.on("close", () => resolve());
    xclip.on("error", reject);
  });
}

async function openBrowser(): Promise<WebDriver> {
  const options = new chrome.Options();

  options.addArguments("--start-maximized");

  options.setUserPreferences({
    "download.default_directory": DOWNLOAD_DIR,
    "download.prompt_for_download": false,
    "download.directory_upgrade": true,
    "safebrowsing.enabled": true,
  });

  return new Builder().forBrowser("chrome").setChromeOptions(options).build();
}

async function typeSlow(text: string, delayMs = 120) {
  for (const char of text) {
    switch (char) {
      case " ":
        await keyboard.pressKey(Key.Space);
        await keyboard.releaseKey(Key.Space);
        await sleep(delayMs);
        continue;
      case "\n":
        await keyboard.pressKey(Key.Enter);
        await keyboard.releaseKey(Key.Enter);
        await sleep(delayMs);
        continue;
      case "\t":
        await keyboard.pressKey(Key.Tab);
        await keyboard.releaseKey(Key.Tab);
        await sleep(delayMs);
        continue;
      case "#":
        await keyboard.pressKey(Key.LeftShift, Key.Num3);
        await keyboard.releaseKey(Key.LeftShift, Key.Num3);
        await sleep(delayMs);
        continue;
      case "*":
        await keyboard.pressKey(Key.Multiply);
        await keyboard.releaseKey(Key.Multiply);
        await sleep(delayMs);
        continue;
      default:
        await keyboard.type(char);
        await sleep(delayMs);
        continue;
    }
  }
}

async function pasteSqlFast(query: string) {
  copyToClipboard(query.trim());
  await sleep(300);

  await keyboard.pressKey(Key.LeftControl);
  await keyboard.pressKey(Key.V);
  await keyboard.releaseKey(Key.V);
  await keyboard.releaseKey(Key.LeftControl);
}

async function login(driver: WebDriver) {
  await driver.get(CARGOSPOT_URL);
  await sleep(15_000);

  await mouse.setPosition(POSITIONS.CSV_COMMA);
  await mouse.click(Button.LEFT);
  await sleep(800);

  await typeSlow(USER);
  await keyboard.pressKey(Key.Tab);
  await keyboard.releaseKey(Key.Tab);
  await sleep(500);

  await typeSlow(PASS);
  await sleep(1_000);
  await keyboard.pressKey(Key.Enter);
  await keyboard.releaseKey(Key.Enter);

  await sleep(15_000);
}

async function openSqlEditor() {
  await keyboard.pressKey(Key.LeftControl);
  await keyboard.pressKey(Key.E);
  await keyboard.releaseKey(Key.E);
  await keyboard.releaseKey(Key.LeftControl);

  await sleep(1500);
}

async function pasteSql(query: string) {
  await mouse.setPosition(POSITIONS.CSV_COMMA);
  await mouse.click(Button.LEFT);
  await sleep(500);

  await mouse.setPosition(POSITIONS.SQL_EDITOR);
  await mouse.click(Button.LEFT);
  await sleep(500);

  await keyboard.pressKey(Key.LeftControl);
  await keyboard.pressKey(Key.A);
  await keyboard.releaseKey(Key.A);
  await keyboard.releaseKey(Key.LeftControl);
  await sleep(200);

  await keyboard.pressKey(Key.Backspace);
  await keyboard.releaseKey(Key.Backspace);
  await sleep(300);

  await pasteSqlFast(query);
  await sleep(2000);

  await mouse.setPosition(POSITIONS.OK_BUTTON);
  await mouse.click(Button.LEFT);
  await sleep(500);
}

export default async function fetchCSData(query: string) {
  const driver = await openBrowser();

  try {
    await login(driver);

    await openSqlEditor();

    await pasteSql(query);

    await sleep(60 * 1000); // Esperar 2 minutos para descarga

    console.log("SQL ejecutado correctamente");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await driver.quit();
  }
}
