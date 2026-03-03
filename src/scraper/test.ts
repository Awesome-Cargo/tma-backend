import { mouse, Button, sleep } from "@nut-tree-fork/nut-js";

async function testClicks() {
  console.log("🧪 Test 1 en 3...");
  await mouse.setPosition({ x: 785, y: 284 });
  await sleep(1000);
  await mouse.click(Button.LEFT);

  console.log("🧪 Test 2 en 3...");
  await mouse.setPosition({ x: 980, y: 838 });
  await sleep(1000);
  await mouse.click(Button.LEFT);

  console.log("🧪 Test 3 en 3...");
  await mouse.setPosition({ x: 1525, y: 940 });
  await sleep(1000);
  await mouse.click(Button.LEFT);

  console.log("✅ Test terminado");
}

testClicks();
