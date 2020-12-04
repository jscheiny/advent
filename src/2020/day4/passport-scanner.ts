import { readFileSync } from "fs";

interface PassportField {
    key: FieldKey;
    value: string;
}

type Passport = Partial<Record<FieldKey, string>>;

enum FieldKey {
    BIRTH_YEAR = "byr",
    ISSUE_YEAR = "iyr",
    EXPIRATION_YEAR = "eyr",
    HEIGHT = "hgt",
    HAIR_COLOR = "hcl",
    EYE_COLOR = "ecl",
    PASSPORT_ID = "pid",
    COUNTRY_ID = "cid",
}

const REQUIRED_FIELD_KEYS: FieldKey[] = [
    FieldKey.BIRTH_YEAR,
    FieldKey.ISSUE_YEAR,
    FieldKey.EXPIRATION_YEAR,
    FieldKey.HEIGHT,
    FieldKey.HAIR_COLOR,
    FieldKey.EYE_COLOR,
    FieldKey.PASSPORT_ID,
];

type FieldKeyValidator = (value: string) => boolean;

const HGT_REGEX = /^(\d{2,3})(cm|in)$/;
const PID_REGEX = /^\d{9}$/;
const HCL_REGEX = /^#[0-9a-f]{6}$/;
const VALID_EYE_COLORS = new Set(["amb", "blu", "brn", "gry", "grn", "hzl", "oth"]);

const FIELD_KEY_VALIDATORS: Record<FieldKey, FieldKeyValidator> = {
    byr: createYearValidator(1920, 2002),
    iyr: createYearValidator(2010, 2020),
    eyr: createYearValidator(2020, 2030),
    hgt: value => {
        const match = HGT_REGEX.exec(value);
        if (match === null) {
            return false;
        }

        const [, heightString, unit] = match;
        try {
            const height = parseInt(heightString, 10);
            if (unit === "cm") {
                return height >= 150 && height <= 193;
            } else {
                return height >= 59 && height <= 76;
            }
        } catch {
            return false;
        }
    },
    hcl: value => HCL_REGEX.test(value),
    ecl: value => VALID_EYE_COLORS.has(value),
    pid: value => PID_REGEX.test(value),
    cid: () => true,
};

function createYearValidator(min: number, max: number): FieldKeyValidator {
    return value => {
        if (value.length !== 4) {
            return false;
        }
        try {
            const year = parseInt(value, 10);
            return year >= min && year <= max;
        } catch {
            return false;
        }
    };
}

function parsePassport(contents: string): Passport {
    const fields = contents
        .split(/\s/)
        .map(section => section.split(":"))
        .map(([key, value]): PassportField => ({ key: key as FieldKey, value }));

    const passport: Passport = {};
    for (const field of fields) {
        if (!(field.key in FIELD_KEY_VALIDATORS)) {
            console.log(field.key, contents);
        }
        passport[field.key] = field.value;
    }
    return passport;
}

function isValidPassport(passport: Passport) {
    for (const key of REQUIRED_FIELD_KEYS) {
        const value = passport[key];
        if (value === undefined) {
            return false;
        }

        const isValid = FIELD_KEY_VALIDATORS[key];
        if (!isValid(value)) {
            return false;
        }
    }
    return true;
}

const count = readFileSync("src/2020/day4/input.txt", { encoding: "utf-8" })
    .split("\n\n")
    .map(parsePassport)
    .filter(isValidPassport).length;
console.log(count);
