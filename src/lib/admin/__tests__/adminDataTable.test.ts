import assert from "node:assert/strict";
import { test } from "vitest";
import { turkishCompare } from "../../../components/admin/ui/AdminDataTable";

test("AdminDataTable & Turkish Sorting unit test suite", () => {
  console.log("Starting AdminDataTable & Turkish Sorting unit test suite...");

  // 1. Turkish Collation Sorting
  {
    const words = ["Zeynep", "Ahmet", "Çiğdem", "İpek", "Işık", "Ömer", "Şencan", "Berk", "Ümit"];
    const sorted = [...words].sort(turkishCompare);

    // In Turkish alphabetical order:
    // A, B, C, Ç, D, E, F, G, Ğ, H, I, İ, J, K, L, M, N, O, Ö, P, R, S, Ş, T, U, Ü, V, Y, Z
    // Expected order:
    // Ahmet, Berk, Çiğdem, Işık, İpek, Ömer, Şencan, Ümit, Zeynep
    assert.equal(sorted[0], "Ahmet");
    assert.equal(sorted[1], "Berk");
    assert.equal(sorted[2], "Çiğdem");
    assert.equal(sorted[3], "Işık");
    assert.equal(sorted[4], "İpek");
    assert.equal(sorted[5], "Ömer");
    assert.equal(sorted[6], "Şencan");
    assert.equal(sorted[7], "Ümit");
    assert.equal(sorted[8], "Zeynep");

    console.log("✓ Turkish special characters (ç, ğ, ı, i, ö, ş, ü) sorted accurately");
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
});
