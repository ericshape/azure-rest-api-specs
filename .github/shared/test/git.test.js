// @ts-check

import { describe, expect, it, vi } from "vitest";
import * as exec from "../src/exec.js";
import { diff, lsTree, show, status } from "../src/git.js";

describe("git", () => {
  describe("e2e", () => {
    it("diff", async () => {
      await expect(diff("HEAD", "HEAD")).resolves.toBe("");
    });

    it("lsTree", async () => {
      // lsTree always uses "\n" in output, even on windows
      const expected = ".github\n";

      await expect(
        lsTree("HEAD", ".github", { args: ["--full-tree", "--name-only"] }),
      ).resolves.toBe(expected);
    });

    it("show", async () => {
      await expect(
        show("HEAD", ".github/shared/package.json"),
      ).resolves.toContain("scripts");
    });

    it("status", async () => {
      // example: "## main...origin/main"
      await expect(
        status({ args: ["-b", "--porcelain", "does-not-exist"] }),
      ).resolves.toContain("##");
    });
  });

  describe("mocked", () => {
    it("diff", async () => {
      const execSpy = vi.spyOn(exec, "execFile").mockResolvedValue("test diff");

      await expect(diff("HEAD^", "HEAD")).resolves.toBe("test diff");

      expect(execSpy).toBeCalledWith(
        "git",
        ["-c", "core.quotepath=off", "diff", "HEAD^", "HEAD"],
        expect.anything(),
      );
    });

    it("lsTree", async () => {
      const execSpy = vi
        .spyOn(exec, "execFile")
        .mockResolvedValue("test lstree");

      await expect(
        lsTree("HEAD", "specification/contosowidgetmanager"),
      ).resolves.toBe("test lstree");

      expect(execSpy).toBeCalledWith(
        "git",
        [
          "-c",
          "core.quotepath=off",
          "ls-tree",
          "HEAD",
          "specification/contosowidgetmanager",
        ],
        expect.anything(),
      );
    });

    it("show", async () => {
      const execSpy = vi.spyOn(exec, "execFile").mockResolvedValue("test show");

      await expect(
        show("HEAD", "specification/contosowidgetmanager/cspell.yaml"),
      ).resolves.toBe("test show");

      expect(execSpy).toBeCalledWith(
        "git",
        [
          "-c",
          "core.quotepath=off",
          "show",
          "HEAD:specification/contosowidgetmanager/cspell.yaml",
        ],
        expect.anything(),
      );
    });

    it("status", async () => {
      const execSpy = vi
        .spyOn(exec, "execFile")
        .mockResolvedValue("test status");

      await expect(
        status({ args: ["-b", "--porcelain", "does-not-exist"] }),
      ).resolves.toBe("test status");

      expect(execSpy).toBeCalledWith(
        "git",
        [
          "-c",
          "core.quotepath=off",
          "status",
          "-b",
          "--porcelain",
          "does-not-exist",
        ],
        expect.anything(),
      );
    });
  });
});
