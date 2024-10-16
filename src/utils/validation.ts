export function isEmailValid(value: string): boolean {
    return /^\w+([-\.]\w+)*@(\w+((\-*\w+)*\.))+[a-zA-Z]{2,4}$/.test(value)
}

export function isCzechPhoneNumberValid(value: string): boolean {
    return /^(\+?420)?(2[0-9]{2}|3[0-9]{2}|4[0-9]{2}|5[0-9]{2}|56[0-9]|60[1-8]|70[2-5]|72[0-9]|73[0-9]|77[0-9]|79[0-9])[0-9]{6}$/.test(
        value
    )
}

export function isSlovakPhoneNumberValid(value: string): boolean {
    return /^(\+?421)?(2[0-9]|3[1-8]|4[1-8]|5[1-8]|6[1-8]|7[0-9]|9[06])[0-9]{7}$/.test(value)
}

export function isPhoneNumberValid(value: string): boolean {
    if (!isCzechPhoneNumberValid(value)) {
        return isSlovakPhoneNumberValid(value)
    }

    return true
}

export function isValidFutureDate(dateString: string): boolean {
    const date = new Date(dateString)
    const toDay = new Date()
    return date.toString() !== "Invalid Date" && date > toDay
}

export function isAdultBirthdateValid(dateString: string): boolean {
    const date = new Date(dateString)
    const toDay = new Date()
    if (date.toString() === "Invalid Date") {
        return false
    }

    const MAX_AGE_TO_INVEST = 100

    if (date.getFullYear() < toDay.getFullYear() - MAX_AGE_TO_INVEST) {
        return false
    }

    const MIN_AGE = 18
    let age = toDay.getFullYear() - date.getFullYear()

    date.setFullYear(date.getFullYear() + age)

    if (date < toDay) {
        age--
    }

    if (age < MIN_AGE) {
        return false
    }

    return true
}

export function isBithNumberValid(value: string): boolean {
    if (!/^\d{6}\/?\d{3,4}$/.test(value)) {
        return false
    }

    const birthNumberWithoutSlash = value.replace("/", "")

    const day = parseInt(birthNumberWithoutSlash.substring(4, 6))
    let month = parseInt(birthNumberWithoutSlash.substring(2, 4))
    const year = parseInt(birthNumberWithoutSlash.substring(0, 2))

    if (month > 50) {
        month -= 50
    }

    const currentYear = new Date().getFullYear()
    const currentYearLastTwoDigits = currentYear % 100

    const fullYear = year <= currentYearLastTwoDigits ? 2000 + year : 1900 + year
    const birthDate = new Date(fullYear, month - 1, day)

    if (
        birthDate.getFullYear() !== fullYear ||
        birthDate.getMonth() !== month - 1 ||
        birthDate.getDate() !== day
    ) {
        return false
    }

    if (birthNumberWithoutSlash.length === 10) {
        const birthNumberAsNumber = parseInt(birthNumberWithoutSlash, 10)
        if (birthNumberAsNumber % 11 !== 0) {
            return false
        }
    } else {
        // * from year 1954 the birth number has to be 10 digits long
        if (fullYear >= 1954) {
            return false
        }
    }

    return isAdultBirthdateValid(birthDate.toISOString())
}

export function isPasswordValid(value: string): boolean {
    return /(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/.test(value)
}