import { Note } from "../Note";
import { Pitch } from "../Pitch";
import { Interval } from "../Interval";
import { cacheMethod } from "../CacheDecorator";

export namespace Chord {
  class ChordBase extends Note.NotRest {
    constructor() {
      super();
    }
  }

  class Chord extends ChordBase {
    private _notes: Note.Note[] = [];

    constructor() {
      super();
    }

    @cacheMethod
    get commonName(): string {}

    get pitches(): Pitch.Pitch[] {
      return this._notes.map((component) => component.pitch);
    }

    set pitches(value: Array<string | Pitch.Pitch | number>) {
      this._notes = [];
      this.clearCache();
      for (const p of value) {
        this._notes.push(new Note.Note(p));
      }
    }

    private _unorderedPitchClasses(): Set<number> {
      const pcGroup: Set<number> = new Set();
      for (const p of this.pitches) {
        pcGroup.add(p.pitchClass);
      }
      return pcGroup;
    }

    get pitchClassCardinality(): number {
      return this._unorderedPitchClasses().size;
    }

    get pitchedCommonName(): string {
      const nameStr = this.commonName;
      if (nameStr === "empty chord") {
        return nameStr;
      }

      if (nameStr === "note" || nameStr === "unison") {
        return this.pitches[0].name;
      }

      if (
        this.pitchClassCardinality <= 2 ||
        nameStr.includes("enharmonic") ||
        nameStr.includes("forte class") ||
        nameStr.includes(" semitone")
      ) {
        // root detection gives weird results for pitchedCommonName
        const bass = this.bass();
        const bassName = bass.name.replace("-", "b");
        return `${nameStr} above ${bassName}`;
      } else {
        let root;
        try {
          root = this.root();
        } catch (e) {
          // if a root cannot be found
          root = this.pitches[0];
        }
        const rootName = root.name.replace("-", "b");
        return `${rootName}-${nameStr}`;
      }
    }
  }
}
