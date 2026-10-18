import assert from "node:assert/strict";
import { turkishCompare } from "../../../components/admin/ui/AdminDataTable";

console.log("Starting AdminDataTable & Turkish Sorting unit test suite...");

// 1. Turkish Collation Sorting
{
  const words = ["Zeynep", "Ahmet", "Cigdem", "Ipek", "Isik", "Omer", "Sencan", "Berk", "Umit"];
  const sorted = [...words].sort(turkishCompare);

  // In Turkish alphabetical order:
  // A, B, C, C, D, E, F, G, G, H, I, I, J, K, L, M, N, O, O, P, R, S, S, T, U, U, V, Y, Z
  // Expected order:
  // Ahmet, Berk, Cigdem, Isik, Ipek, Omer, Sencan, Umit, Zeynep
  assert.equal(sorted[0], "Ahmet");
  assert.equal(sorted[1], "Berk");
  assert.equal(sorted[2], "Cigdem");
  assert.equal(sorted[3], "Isik");
  assert.equal(sorted[4], "Ipek");
  assert.equal(sorted[5], "Omer");
  assert.equal(sorted[6], "Sencan");
  assert.equal(sorted[7], "Umit");
  assert.equal(sorted[8], "Zeynep");

  console.log("✓ Turkish special characters (c, g, i, i, o, s, u) sorted accurately");
}

// 2. Numeric-aware Collation
{
  const codes = ["SEC-2", "SEC-10", "SEC-1", "SEC-20"];
  const sorted = [...codes].sort(turkishCompare);
  assert.deepEqual(sorted, ["SEC-1", "SEC-2", "SEC-10", "SEC-20"]);
  console.log("✓ Numeric-aware natural sort passed");
}

// 3. Null and undefined safety
{
  assert.equal(turkishCompare(null, "Test") < 0, true);
  assert.equal(turkishCompare("Test", null) > 0, true);
  assert.equal(turkishCompare(null, null), 0);
  assert.equal(turkishCompare(undefined, undefined), 0);
  console.log("✓ Null/undefined boundary checks passed");
}

console.log("==========================================");
console.log("ALL ADMINDATATABLE UNIT TESTS PASSED");
console.log("==========================================");
