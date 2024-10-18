/**
* @param {string} filename
* @returns {string} file extension if it is found after dot within file name otherwise empty string
*/
export function getFileExtension(filename: string): string {
    const index = filename.lastIndexOf(".")
    return index !== -1 ? filename.substring(index + 1) : ""
}

/**
 * @param {string} text text to sanitize
 * @returns {string} value special characters and dots replaced with underscore
 */
export function sanitizedFilename(text: string): string {
    const invalidRegex = /[<>:"/\\|?*\u0000-\u001F\. ]/g
    const value = text.replace(invalidRegex, "_")

    const MAX_FILENAME_LENGTH_WITH_SPACE_FOR_EXTENSION = 230
    if (value.length > MAX_FILENAME_LENGTH_WITH_SPACE_FOR_EXTENSION) {
        return value.substring(0, MAX_FILENAME_LENGTH_WITH_SPACE_FOR_EXTENSION)
    }

    return value
}

export function getDayDifferenceFromNow(date: Date) {
    const timeDifference = Date.now() - date.getTime()
    return Math.floor(timeDifference / (1000 * 60 * 60 * 24))
}


export function getInflexion(number: number, singular: string, dual: string, plural: string) {
    if (number === 1) {
        return singular
    } else if (number > 1 && number < 5) {
        return dual
    } else {
        return plural
    }
}

export function convertIbanToAccountNumber(iban: string) {
    const cleanIban = iban.replace(/\s+/g, "")

    if (!cleanIban.startsWith("CZ") || cleanIban.length !== 24) {
        return iban
    }

    const bankCode = cleanIban.slice(4, 8)

    let accountNumberPart = cleanIban.slice(8)

    let accountNumber = accountNumberPart.replace(/^0+/, "")
    let prefix = ""

    if (accountNumber.length > 10) {
        prefix = accountNumber.slice(0, accountNumber.length - 10)
        accountNumber = accountNumber.slice(accountNumber.length - 10).replace(/^0+/, "")

        accountNumber = `${prefix}-${accountNumber}`
    }

    return `${accountNumber}/${bankCode}`
}

export function getLocalLanguageCode() {
    return navigator.language.substring(0, 2)
}

export function parseToIntOrReturnNull(value: string | null): number | null {
    if (value === null) {
        return null
    }

    const parsed = parseInt(value, 10)
    if (isNaN(parsed)) {
        return null
    }

    if (parsed.toString() !== value) {
        return null
    }

    return parsed
}