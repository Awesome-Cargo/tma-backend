import "dotenv/config";
import { Builder, Key, WebDriver, Origin } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome.js";
import * as path from "path";
import fs from "fs/promises";

const CARGOSPOT_URL =
  "https://cargospot-web.cscloud.champ.aero/a7-prod-mt/?args=%7B%22m%22%3A%22C%22%7D";

const USER = process.env.CARGOSPOT_USER ?? "";
const PASS = process.env.CARGOSPOT_PASS ?? "";
const SELENIUM_REMOTE_URL = process.env.SELENIUM_REMOTE_URL ?? "";
const SCRAPER_WINDOW_WIDTH = Number(process.env.SCRAPER_WINDOW_WIDTH ?? 1920);
const SCRAPER_WINDOW_HEIGHT = Number(process.env.SCRAPER_WINDOW_HEIGHT ?? 1080);
const SCRAPER_BASE_WIDTH = Number(process.env.SCRAPER_BASE_WIDTH ?? 1920);
const SCRAPER_BASE_HEIGHT = Number(process.env.SCRAPER_BASE_HEIGHT ?? 1080);
const SCRAPER_SCALE_COORDINATES =
  (process.env.SCRAPER_SCALE_COORDINATES ?? "true").toLowerCase() === "true";
const SCRAPER_COORDINATES_RELATIVE_TO_APP =
  (process.env.SCRAPER_COORDINATES_RELATIVE_TO_APP ?? "false").toLowerCase() ===
  "true";
const SCRAPER_CONTROLS_RELATIVE_TO_APP =
  (process.env.SCRAPER_CONTROLS_RELATIVE_TO_APP ?? "true").toLowerCase() ===
  "true";
const SCRAPER_QUERY_TYPE_DELAY_MS = Number(
  process.env.SCRAPER_QUERY_TYPE_DELAY_MS ?? 0,
);
const SCRAPER_LOGIN_TYPE_DELAY_MS = Number(
  process.env.SCRAPER_LOGIN_TYPE_DELAY_MS ?? 0,
);
const SCRAPER_PASS_TYPE_DELAY_MS = Number(
  process.env.SCRAPER_PASS_TYPE_DELAY_MS ?? 35,
);
const SCRAPER_QUERY_AFTER_TYPE_WAIT_MS = Number(
  process.env.SCRAPER_QUERY_AFTER_TYPE_WAIT_MS ?? 350,
);
const SCRAPER_LOGIN_INITIAL_WAIT_MS = Number(
  process.env.SCRAPER_LOGIN_INITIAL_WAIT_MS ?? 15000,
);
const SCRAPER_LOGIN_AFTER_SUBMIT_WAIT_MS = Number(
  process.env.SCRAPER_LOGIN_AFTER_SUBMIT_WAIT_MS ?? 15000,
);
const SCRAPER_OPEN_EDITOR_WAIT_MS = Number(
  process.env.SCRAPER_OPEN_EDITOR_WAIT_MS ?? 1500,
);
const SCRAPER_POST_F5_WAIT_MS = Number(
  process.env.SCRAPER_POST_F5_WAIT_MS ?? 700,
);
const SCRAPER_NAVIGATION_RETRIES = Number(
  process.env.SCRAPER_NAVIGATION_RETRIES ?? 3,
);
const SCRAPER_NAVIGATION_RETRY_WAIT_MS = Number(
  process.env.SCRAPER_NAVIGATION_RETRY_WAIT_MS ?? 1200,
);
const SCRAPER_USE_CLIPBOARD =
  (process.env.SCRAPER_USE_CLIPBOARD ?? "true").toLowerCase() === "true";
const SCRAPER_ENSURE_CSV_COMMA =
  (process.env.SCRAPER_ENSURE_CSV_COMMA ?? "true").toLowerCase() === "true";
const SCRAPER_DEBUG_CLICKS =
  (process.env.SCRAPER_DEBUG_CLICKS ?? "true").toLowerCase() === "true";

const POSITIONS = {
  CSV_COMMA: {
    x: Number(process.env.SCRAPER_CSV_COMMA_X ?? 640),
    y: Number(process.env.SCRAPER_CSV_COMMA_Y ?? 230),
  },
  CSV_COMMA_CHECKBOX: {
    x: Number(
      process.env.SCRAPER_CSV_COMMA_CHECKBOX_X ??
        730,
    ),
    y: Number(process.env.SCRAPER_CSV_COMMA_CHECKBOX_Y ?? 107),
  },
  // Query editor (cyan area in Cargospot UI)
  SQL_EDITOR: {
    x: Number(process.env.SCRAPER_SQL_EDITOR_X ?? 650),
    y: Number(process.env.SCRAPER_SQL_EDITOR_Y ?? 710),
  },
};

const CHROME_DOWNLOAD_DIR =
  process.env.CHROME_DOWNLOAD_DIR ?? "/home/seluser/Downloads";
const SCRAPER_LOCAL_DOWNLOAD_DIR = process.env.SCRAPER_LOCAL_DOWNLOAD_DIR
  ? path.resolve(process.env.SCRAPER_LOCAL_DOWNLOAD_DIR)
  : path.resolve(process.cwd(), "downloads");
const SCRAPER_DEBUG_DIR = process.env.SCRAPER_DEBUG_DIR
  ? path.resolve(process.env.SCRAPER_DEBUG_DIR)
  : path.resolve(SCRAPER_LOCAL_DOWNLOAD_DIR, "debug-clicks");

if (!USER || !PASS) {
  throw new Error("Faltan variables para Cargospot (USER/PASSWORD)");
}

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

let debugShotCounter = 0;

async function captureDebugScreenshot(
  driver: WebDriver,
  label: string,
  x: number,
  y: number,
  phase: "before" | "after",
) {
  if (!SCRAPER_DEBUG_CLICKS) return;

  await fs.mkdir(SCRAPER_DEBUG_DIR, { recursive: true });
  const safeLabel = label.replace(/[^a-z0-9_-]/gi, "_").toLowerCase();
  const shotId = String(++debugShotCounter).padStart(4, "0");
  const fileName = `${shotId}_${safeLabel}_${phase}_${x}_${y}.png`;
  const filePath = path.join(SCRAPER_DEBUG_DIR, fileName);

  await driver.executeScript(
    `
      const markerId = "__codex_click_marker__";
      const old = document.getElementById(markerId);
      if (old) old.remove();

      const dot = document.createElement("div");
      dot.id = markerId;
      dot.style.position = "fixed";
      dot.style.left = (arguments[0] - 8) + "px";
      dot.style.top = (arguments[1] - 8) + "px";
      dot.style.width = "16px";
      dot.style.height = "16px";
      dot.style.borderRadius = "50%";
      dot.style.background = "rgba(255,0,0,0.9)";
      dot.style.border = "2px solid #fff";
      dot.style.zIndex = "2147483647";
      dot.style.pointerEvents = "none";

      const text = document.createElement("div");
      text.textContent = arguments[2];
      text.style.position = "fixed";
      text.style.left = (arguments[0] + 12) + "px";
      text.style.top = (arguments[1] - 8) + "px";
      text.style.padding = "2px 6px";
      text.style.fontSize = "11px";
      text.style.fontFamily = "monospace";
      text.style.color = "#fff";
      text.style.background = "rgba(0,0,0,0.75)";
      text.style.zIndex = "2147483647";
      text.style.pointerEvents = "none";
      text.id = markerId + "_label";

      document.body.appendChild(dot);
      document.body.appendChild(text);
    `,
    x,
    y,
    `${label}:${phase}`,
  );

  await sleep(80);
  const screenshot = await driver.takeScreenshot();
  await fs.writeFile(filePath, Buffer.from(screenshot, "base64"));

  await driver.executeScript(
    `
      const markerId = "__codex_click_marker__";
      const dot = document.getElementById(markerId);
      if (dot) dot.remove();
      const text = document.getElementById(markerId + "_label");
      if (text) text.remove();
    `,
  );
}

async function resolveClickPoint(
  driver: WebDriver,
  coordinates: { x: number; y: number },
  relativeToApp = SCRAPER_COORDINATES_RELATIVE_TO_APP,
) {
  const rect = await driver.manage().window().getRect();
  const appRect = relativeToApp
    ? await driver.executeScript<{
        left: number;
        top: number;
      } | null>(`
        const nodes = [...document.querySelectorAll('canvas, iframe, div')];
        let best = null;
        for (const node of nodes) {
          const r = node.getBoundingClientRect();
          const area = r.width * r.height;
          if (r.width < 200 || r.height < 150) continue;
          if (!best || area > best.area) {
            best = { left: r.left, top: r.top, area };
          }
        }
        return best ? { left: best.left, top: best.top } : null;
      `)
    : null;

  const scaledX = SCRAPER_SCALE_COORDINATES
    ? Math.round((coordinates.x * rect.width) / SCRAPER_BASE_WIDTH)
    : coordinates.x;
  const scaledY = SCRAPER_SCALE_COORDINATES
    ? Math.round((coordinates.y * rect.height) / SCRAPER_BASE_HEIGHT)
    : coordinates.y;

  const targetX = appRect ? Math.round(appRect.left + scaledX) : scaledX;
  const targetY = appRect ? Math.round(appRect.top + scaledY) : scaledY;

  const safeX = Math.min(Math.max(1, targetX), Math.max(1, rect.width - 2));
  const safeY = Math.min(Math.max(1, targetY), Math.max(1, rect.height - 2));

  return { safeX, safeY };
}

async function performClickAtPoint(driver: WebDriver, x: number, y: number) {
  try {
    await driver
      .actions({ async: true })
      .move({ origin: Origin.VIEWPORT, x, y })
      .click()
      .perform();
  } catch {
    // Fallback for layered canvas/webswing overlays.
    await driver.executeScript(
      `
      const x = arguments[0];
      const y = arguments[1];
      const el = document.elementFromPoint(x, y);
      if (!el) return false;
      el.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: x, clientY: y }));
      el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: x, clientY: y }));
      el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientX: x, clientY: y }));
      el.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: x, clientY: y }));
      return true;
      `,
      x,
      y,
    );
  }
}

async function openBrowser(): Promise<WebDriver> {
  const options = new chrome.Options();

  options.addArguments("--start-maximized", "--disable-dev-shm-usage");

  options.setUserPreferences({
    "download.default_directory": CHROME_DOWNLOAD_DIR,
    "download.prompt_for_download": false,
    "download.directory_upgrade": true,
    "safebrowsing.enabled": true,
  });

  const builder = new Builder().forBrowser("chrome").setChromeOptions(options);
  if (SELENIUM_REMOTE_URL) {
    builder.usingServer(SELENIUM_REMOTE_URL);
  }

  const driver = await builder.build();
  await driver.manage().setTimeouts({
    pageLoad: 90_000,
    script: 30_000,
    implicit: 0,
  });
  await driver
    .manage()
    .window()
    .setRect({ width: SCRAPER_WINDOW_WIDTH, height: SCRAPER_WINDOW_HEIGHT });

  return driver;
}

async function clickAt(
  driver: WebDriver,
  coordinates: { x: number; y: number },
  options?: { relativeToApp?: boolean },
): Promise<void> {
  const { safeX, safeY } = await resolveClickPoint(
    driver,
    coordinates,
    options?.relativeToApp,
  );
  await performClickAtPoint(driver, safeX, safeY);
}

async function clickWithRetry(
  driver: WebDriver,
  coordinates: { x: number; y: number },
  label: string,
  retries = 3,
  options?: { relativeToApp?: boolean },
) {
  const offsets = [
    { x: 0, y: 0 },
    { x: 8, y: 0 },
    { x: -8, y: 0 },
    { x: 0, y: 8 },
    { x: 0, y: -8 },
  ];
  let lastError: unknown;
  for (let i = 0; i < Math.max(retries, offsets.length); i += 1) {
    const offset = offsets[i % offsets.length] ?? offsets[0]!;
    try {
      const { safeX, safeY } = await resolveClickPoint(
        driver,
        { x: coordinates.x + offset.x, y: coordinates.y + offset.y },
        options?.relativeToApp,
      );
      await captureDebugScreenshot(driver, label, safeX, safeY, "before");
      await performClickAtPoint(driver, safeX, safeY);
      await captureDebugScreenshot(driver, label, safeX, safeY, "after");
      return;
    } catch (error) {
      lastError = error;
      await sleep(300);
    }
  }
  throw new Error(`No se pudo hacer click en ${label}: ${String(lastError)}`);
}

async function typeSlow(driver: WebDriver, text: string, delayMs = 120) {
  for (const char of text) {
    await driver.actions({ async: true }).sendKeys(char).perform();
    await sleep(delayMs);
  }
}

async function keyCombo(
  driver: WebDriver,
  modifier: string,
  key: string,
): Promise<void> {
  await driver
    .actions({ async: true })
    .keyDown(modifier)
    .sendKeys(key)
    .keyUp(modifier)
    .perform();
}

async function tryPasteFromClipboard(
  driver: WebDriver,
  text: string,
): Promise<boolean> {
  try {
    const pasted = await driver.executeScript(
      `
        const value = arguments[0];
        if (!navigator.clipboard || !navigator.clipboard.writeText) {
          return false;
        }
        return navigator.clipboard.writeText(value).then(() => true).catch(() => false);
      `,
      text,
    );
    if (!pasted) return false;

    await keyCombo(driver, Key.CONTROL, "v");
    return true;
  } catch {
    return false;
  }
}

async function typeOrPasteText(
  driver: WebDriver,
  text: string,
  delayMs: number,
): Promise<void> {
  const usedClipboard = SCRAPER_USE_CLIPBOARD
    ? await tryPasteFromClipboard(driver, text)
    : false;

  if (usedClipboard) return;

  if (delayMs > 0) {
    await typeSlow(driver, text, delayMs);
    return;
  }

  await driver.actions({ async: true }).sendKeys(text).perform();
}

async function openCargospotWithRetry(driver: WebDriver) {
  const retries = Math.max(1, SCRAPER_NAVIGATION_RETRIES);
  let lastUrl = "";
  let lastError: unknown;

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      await driver.get(CARGOSPOT_URL);
      await sleep(Math.max(300, SCRAPER_NAVIGATION_RETRY_WAIT_MS));
      lastUrl = await driver.getCurrentUrl();
      if (!lastUrl.startsWith("data:")) {
        return;
      }
    } catch (error) {
      lastError = error;
    }

    await sleep(Math.max(300, SCRAPER_NAVIGATION_RETRY_WAIT_MS));
  }

  throw new Error(
    `No se pudo abrir Cargospot. URL actual: ${lastUrl || "desconocida"}. ${lastError ? `Detalle: ${String(lastError)}` : ""}`,
  );
}

async function login(driver: WebDriver) {
  console.log("[scraper] Abriendo Cargospot...");
  await openCargospotWithRetry(driver);
  await sleep(SCRAPER_LOGIN_INITIAL_WAIT_MS);

  console.log("[scraper] Iniciando login...");
  await clickAt(driver, POSITIONS.CSV_COMMA);
  await sleep(800);

  await typeOrPasteText(driver, USER, SCRAPER_LOGIN_TYPE_DELAY_MS);
  await driver.actions({ async: true }).sendKeys(Key.TAB).perform();
  await sleep(500);

  await typeSlow(driver, PASS, Math.max(10, SCRAPER_PASS_TYPE_DELAY_MS));
  await sleep(1000);
  await driver.actions({ async: true }).sendKeys(Key.ENTER).perform();

  await sleep(SCRAPER_LOGIN_AFTER_SUBMIT_WAIT_MS);
}

async function openSqlEditor(driver: WebDriver) {
  await keyCombo(driver, Key.CONTROL, "e");
  await sleep(SCRAPER_OPEN_EDITOR_WAIT_MS);
}

async function ensureCsvCommaSelected(driver: WebDriver) {
  if (!SCRAPER_ENSURE_CSV_COMMA) return;

  // NOTE: Cargospot/WebSwing does not expose reliable checked-state access,
  // so target the checkbox area directly.
  await clickWithRetry(driver, POSITIONS.CSV_COMMA_CHECKBOX, "CSV Comma", 3, {
    relativeToApp: SCRAPER_CONTROLS_RELATIVE_TO_APP,
  });
  await sleep(500);
}

async function pasteSql(driver: WebDriver, query: string) {
  // Force focus into SQL query editor (cyan area)
  await clickAt(driver, POSITIONS.SQL_EDITOR, {
    relativeToApp: SCRAPER_CONTROLS_RELATIVE_TO_APP,
  });
  await sleep(250);
  await clickAt(driver, POSITIONS.SQL_EDITOR, {
    relativeToApp: SCRAPER_CONTROLS_RELATIVE_TO_APP,
  });
  await sleep(500);

  await keyCombo(driver, Key.CONTROL, "a");
  await sleep(200);

  await driver.actions({ async: true }).sendKeys(Key.BACK_SPACE).perform();
  await sleep(300);

  const queryText = query.trim();
  const usedClipboard = SCRAPER_USE_CLIPBOARD
    ? await tryPasteFromClipboard(driver, queryText)
    : false;

  // Fallback for environments where clipboard write is blocked.
  if (!usedClipboard) {
    if (SCRAPER_QUERY_TYPE_DELAY_MS > 0) {
      await typeSlow(driver, queryText, SCRAPER_QUERY_TYPE_DELAY_MS);
    } else {
      await driver.actions({ async: true }).sendKeys(queryText).perform();
    }
  }
  await sleep(SCRAPER_QUERY_AFTER_TYPE_WAIT_MS);

  await ensureCsvCommaSelected(driver);
  await sleep(350);

  // CHAMP executes the query via keyboard shortcut.
  await driver.actions({ async: true }).sendKeys(Key.F5).perform();
  await sleep(SCRAPER_POST_F5_WAIT_MS);
}

export default async function fetchCSData(query: string) {
  const driver = await openBrowser();

  try {
    console.log("[scraper] Sesion de navegador iniciada");
    await login(driver);

    console.log("[scraper] Abriendo editor SQL...");
    await openSqlEditor(driver);

    console.log("[scraper] Pegando query y ejecutando F5...");
    await pasteSql(driver, query);

    await sleep(60 * 1000);
    console.log("SQL ejecutado correctamente");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await driver.quit();
  }
}
