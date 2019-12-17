import is from 'is_js';

/**
 * A Moodle Context Level number. These are the actual numbers used in the
 * Moodle database tables to represent the different context levels.
 *
 * @typedef {string|number} ContextLevelNumber
 * @example '10'
 */

/**
 * A Moodle Context Level name. These are the names of the PHP constants defined
 * in the Moodle code
 * (`[lib/accesslib.php](https://github.com/moodle/moodle/blob/master/lib/accesslib.php)`).
 *
 * @typedef {string} ContextLevelName
 * @example 'CONTEXT_SYSTEM'
 */

/**
 * The base names for a Moodle Context Level. These are the names of the PHP
 * constants with the `CONTEXT_` prefix removed and converted to lower case.
 *
 * @typedef {string} ContextLevelBaseName
 * @example 'system'
 * @see {@link ContextLevelName}
 */

/**
 * An alias for the base name for the Moodle Context Level. These names consist
 * of only camel-cased letters.
 *
 * @typedef {string} ContextLevelAlias
 * @example 'courseCategory'
 */

/**
 * A mapping from context level numbers to context level base names.
 * 
 * @type {Map<ContextLevelNumber, ContextLevelBaseName>}
 * @protected
 */
const NUM_BASENAME_MAP = {
    '10': 'system',
    '30': 'user',
    '40': 'coursecat',
    '50': 'course',
    '70': 'module',
    '80': 'block'
};

/**
 * A mapping from context level numbers to context level names.
 * 
 * @type {Map<ContextLevelNumber, ContextLevelName>}
 * @protected
 */
const NUM_NAME_MAP = {};
for(const num of Object.keys(NUM_BASENAME_MAP)){
	NUM_NAME_MAP[num] = `CONTEXT_${NUM_BASENAME_MAP[num].toUpperCase()}`;
}

/**
 * A mapping of base names to an array of aliases.
 *
 * @type {Map<ContextLevelBaseName, ContextLevelAlias[]>}
 * @protected
 */
const BASENAME_ALIASES_MAP = {
	system: [],
	user: [],
	coursecat: ['courseCategory', 'category'],
	course: [],
	module: [],
	block: []
};

/**
 * A mapping form context level names to context level numbers.
 * 
 * @type {Map<ContextLevelName, ContextLevelNumber>}
 * @protected
 */
const NAME_NUM_MAP = {};
for(const num of Object.keys(NUM_NAME_MAP)){
    NAME_NUM_MAP[NUM_NAME_MAP[num]] = parseInt(num);
}

/**
 * A mapping from context level base names and aliases to context level numbers.
 * 
 * @type {Map<ContextLevelBaseName|ContextLevelAlias, ContextLevelNumber>}
 * @protected
 */
const BASENAME_NUM_MAP = {};
for(const num of Object.keys(NUM_BASENAME_MAP)){
    BASENAME_NUM_MAP[NUM_BASENAME_MAP[num]] = parseInt(num);
}
for(const bn of Object.keys(BASENAME_ALIASES_MAP)){
	const aliases = BASENAME_ALIASES_MAP[bn];
	for(const bna of aliases){
		BASENAME_NUM_MAP[bna] = BASENAME_NUM_MAP[bn];
	}
}

/**
 * A mapping from lowser-cased context level base names and aliases to context
 * level numbers.
 * 
 * @type @type {Map<string, ContextLevelNumber>}
 * @protected
 */
const LC_BASENAME_NUM_MAP = {};
for(const bn of Object.keys(BASENAME_NUM_MAP)){
	LC_BASENAME_NUM_MAP[bn.toLowerCase()] = BASENAME_NUM_MAP[bn];
}

/**
 * A class for representing
 * [Context Levels](https://docs.moodle.org/38/en/Assign_roles#Context_and_roles)
 * within the [Moodle VLE](http://moodle.org/)'s permissions system.
 *
 * As well as the various functions and properties described in the documetation
 * below there are also dynamically created properties with each valid context
 * level name which get MoodleContextLevel instances for the matching level.
 * In many instances these accessors will obviate the need to use a contructor.
 *
 * ```
 * const sysCtx = MoodleContextLevel.system;
 * const courseCtx = MoodleContextLevel.CONTEXT_COURSE;
 * ```
 * 
 * @see https://docs.moodle.org/38/en/Assign_roles#Context_and_roles
 */
class MoodleContextLevel {
    /**
     * The default context is `CONTEXT_SYSTEM`.
     *
     * @param {ContextLevelNumber|ContextLevelName|ContextLevelBaseName|ContextLevelAlias} context
     * @throws TypeError
     * @throws RangeError
     */
    constructor(context){
		// default to system context
		let num = BASENAME_NUM_MAP.system;
		
		// process args (if any)
		if(is.not.undefined(context)){
			num = MoodleContextLevel.parseToNumber(context); // could throw error
		}
		
        /**
         * @type {ContextLevelNumber}
         */
        this._number = num;
    }
	
	/**
	 * A list of all existing context level names as they appear in the
	 * Moodle source code sorted from lowest context level number to highest.
	 *
	 * @type {string[]}
	 */
	static get names(){
		const ans = [];
		for(const n of Object.keys(NUM_NAME_MAP).sort()){
			ans.push(NUM_NAME_MAP[n]);
		}
		return ans;
	}
	
	/**
	 * An alphabetic list of all defined base names, including aliases.
	 *
	 * @type {string[]}
	 */
	static get baseNames(){
		return Object.keys(BASENAME_NUM_MAP).sort();
	}
	
	/**
	 * An alphabetic list of all defined level names, be they full names as they
	 * appear in the Moodle  source code, base names, or aliases.
	 *
	 * @type {string[]}
	 */
	static get allNames(){
		return [
			...MoodleContextLevel.names,
			...MoodleContextLevel.baseNames
		].sort();
	}
	
	/**
	 * A sorted list of all defined context level numbers.
	 *
	 * @type {number[]}
	 */
	static get levelNumbers(){
		return Object.keys(NUM_BASENAME_MAP).map(n => parseInt(n)).sort();
	}
	
	/**
	 * A list of all context levels sorted by context level number.
	 *
	 * @type {MoodleContextLevel[]}
	 */
	static get levels(){
		return MoodleContextLevel.names.map(n=>new MoodleContextLevel(n));
	}
    
    /**
     * Test if a given value is a valid Moodle Context Level Number.
     *
     * @param {*} val - the value to test.
     * @param {boolean} [strictTypeCheck=false] - whether or not to enable
     * strict type checking. With strict type cheking enabled, string
     * representation of otherwise valid values will return `false`.
     * @return {boolean}
	 * @see {@link ContextLevelNumber}
     */
    static isContextLevelNumber(val, strictTypeCheck){
        if(is.not.number(val)){
            if(strictTypeCheck) return false;
            if(is.not.string(val)) return false;
        }
        return String(val).match(/^[134578]0$/) ? true : false;
    }
    
    /**
     * Test if a given value is a valid Moodle Context Level Name.
	 *
	 * By default names, base names, and aliases are considered valid, but with
	 * strict checking only the full context level names as used in the Moodle
	 * source code will be accepted.
     *
     * @param {*} val - the value to test.
     * @param {boolean} [strictCheck=false] - By default any name that can be
	 * resolved to a context level number, ignoring case,  will be considered
	 * valid, but if a truthy value is passed only full context level names in
	 * the correct case exactly as used in the Moodle source code will be
	 * accepted. 
     * @return {boolean}
	 * @see {@link ContextLevelName}
	 * @see {@link ContextLevelBaseName}
	 * @see {@link ContextLevelAlias}
     */
    static isContextLevelName(val, strictCheck){
		// short-circuit non-strings
        if(is.not.string(val)) return false;
		
		// sort-circuit the passing strict check
		if(NAME_NUM_MAP[val]) return true;
		
		// we only strict is acceptable, return false
		if(strictCheck) return false;
		
		// a case-insensitive check of names
		if(NAME_NUM_MAP[val.toUpperCase()]) return true;
		
		// a case-insensitive check of base names and aliases
		if(LC_BASENAME_NUM_MAP[val.toLowerCase()]) return true;
		
		// if we got here the name is not valid
        return false;
    }
    
    /**
     * Convert any valid name to a context level number. Valid names are
	 * context level names as they appear in the Moodle code, context level
	 * base names, and context level aliases.
     *
     * @param {ContextLevelName, ContextLevelBaseName, ContextLevelAlias} name
     * @return {ContextLevelNumber|NaN} If the passed value can't be converted
     * to a context level number `NaN` is returned.
     */
    static numberFromName(name){
        if(is.not.string(name)) return NaN;
		const ucName = name.toUpperCase();
        if(NAME_NUM_MAP[ucName]) return NAME_NUM_MAP[ucName];
		const lcName = name.toLowerCase();
		if(LC_BASENAME_NUM_MAP[lcName]) return LC_BASENAME_NUM_MAP[lcName];
        return NaN;
    }
    
    /**
     * Compare two values to see if they represent the same context level, a
     * greater context level, or a lesser context level.
     *
     * Context levels are compared based on their context level number.
     *
     * @param {*} val1
     * @param {*} val2
     * @return {number} Unless both values are context level objects, `NaN` is
     * returned. If `val1` represents lower context level number than `val2`
	 * `-1` is returned, if `val1` and `val2` represent the same context level
	 * `0` is returned, and if `val1` represents a greater context level number
	 * version than `val2` `1` is returned.
     */
    static compare(val1, val2){
        // unless we get two Moodle context levels, return NaN
        if(!((val1 instanceof MoodleContextLevel) && (val2 instanceof MoodleContextLevel))) return NaN;
        
        // compare numeric representations
        const l1 = val1.number;
		const l2 = val2.number;
        if(l1 < l2) return -1;
        if(l1 > l2) return 1;
		return 0;
    }
    
    /**
     * A factory method to build a {@link MoodleContextLevel} object from any
     * parsable value. The following are supported:
     *
     * * A valid context level number (as a number or string)
	 * * A valid context level name as used in the Moodle code base (in any case).
	 * * A valid context level base name (in any case).
	 * * A valid context level alias (in any case).
	 * * A context level object.
     *
     * @param {number|string|MoodleContextLevel} level - the context level value to parse.
     * @return {MoodleContextLevel}
     * @throws {TypeError}
     * @throws {RangeError}
     * @see {@link ContextLevelNumber}
     * @see {@link ContextLevelName}
     * @see {@link ContextLevelBaseName}
     * @see {@link ContextLevelAlias}
     */
    static parse(level){
		return new MoodleContextLevel(MoodleContextLevel.parseToNumber(level));
    }
    
    /**
     * Try to convert a value to a context level number. The following values
     * are supported:
     *
     * * A valid context level number (as a number or string)
	 * * A valid context level name as used in the Moodle code base (in any case).
	 * * A valid context level base name (in any case).
	 * * A valid context level alias (in any case).
	 * * A context level object.
     *
     * @param {number|string|MoodleContextLevel} level - the context level value to parse.
     * @return {MoodleContextLevelNumber}
     * @throws {TypeError}
     * @throws {RangeError}
     * @see {@link ContextLevelNumber}
     * @see {@link ContextLevelName}
     * @see {@link ContextLevelBaseName}
     * @see {@link ContextLevelAlias}
     */
    static parseToNumber(level){
		if(level instanceof MoodleContextLevel){
			return level.number;
		}
		if(is.number(level) || is.string(level)){
			const strLevel = String(level);
			if(strLevel.match(/^\d{2}$/)){
				// is integer, check if it's a valid key
				if(NUM_BASENAME_MAP[level]){
					return parseInt(level);
				}else{
					throw new RangeError(`unknown level '${level}'`);
				}
			}else{
				// is not an integer, so check if it's a known name
				const num = MoodleContextLevel.numberFromName(level);
				if(num){
					return num;
				}else{
					throw new RangeError(`unknown level '${level}'`);
				}
			}
		}
        throw new TypeError('invalid value - level must be a number, string, or MoodleContextLevel object');
    }
	
	/**
     * Try to convert a value to a context level name as used in the Moodle
     * source code. The following values are supported:
     *
     * * A valid context level number (as a number or string)
	 * * A valid context level name as used in the Moodle code base (in any case).
	 * * A valid context level base name (in any case).
	 * * A valid context level alias (in any case).
	 * * A context level object.
     *
     * @param {number|string|MoodleContextLevel} level - the context level value to parse.
     * @return {MoodleContextLevelName}
     * @throws {TypeError}
     * @throws {RangeError}
     * @see {@link ContextLevelNumber}
     * @see {@link ContextLevelName}
     * @see {@link ContextLevelBaseName}
     * @see {@link ContextLevelAlias}
     */
    static parseToName(level){
		if(level instanceof MoodleContextLevel){
			return level.name;
		}
		if(is.number(level) || is.string(level)){
			const strLevel = String(level);
			if(strLevel.match(/^\d{2}$/)){
				// is integer, check if it's a valid key
				if(NUM_BASENAME_MAP[level]){
					return NUM_NAME_MAP[level];
				}else{
					throw new RangeError(`unknown level '${level}'`);
				}
			}else{
				// is not an integer, so check if it's a known name
				const num = MoodleContextLevel.parseToNumber(level);
				if(num){
					return NUM_NAME_MAP[num];
				}else{
					throw new RangeError(`unknown level '${level}'`);
				}
			}
		}
        throw new TypeError('invalid value - level must be a number, string, or MoodleContextLevel object');
    }
    
    /**
     * The level's numeric value.
     *
     * @type {number}
     */
    get number(){
        return this._number;
    }
    
    /**
     * The level's numeric value, must be one of the levels defined in
     * `lib/accesslib.php` in the Moodle source code.
     *
     * @type {ContextLevelNumber}
     * @throws {TypeError}
     * @throws {RangeError}
     */
    set number(n){
        if(!String(n).match(/^-?\d+$/)){
			throw new TypeError('must be a number');
		}
		if(!MoodleContextLevel.isContextLevelNumber(n)){
			throw new RangeError(`unknown level '${n}'`);
		}
		this._number = parseInt(n); // force to a number
    }
    
    /**
     * The level's name as it appears in the Moodle sourse code.
     *
     * @type {ContextLevelName}
     */
    get name(){
        return NUM_NAME_MAP[this._number];
    }
    
    /**
     * The level's name in any valid form.
     *
     * Any name that can be parsed by the `nameFromNumber()` static function
     * is acceptable.
     *
     * @type {(ContextLevelName|ContextLevelBaseName|ContextLevelAlias)}
     * @throws {TypeError}
     * @throws {RangeError}
     * @see MoodleContextLevel.nameFromNumber
     */
    set name(n){
        if(is.not.string(n)) throw new TypeError('must be a string');
		const num = MoodleContextLevel.numberFromName(n);
		if(num){
			this._number = num;
		}else{
			throw new RangeError(`unknown level '${n}'`);
		}
    }
    
    /**
     * The level's base name.
     *
     * @type {ContextLevelBaseName}
     */
    get baseName(){
        return NUM_BASENAME_MAP[this._number];
    }
	
	/**
	 * All the level's aliases.
	 *
	 * @type {ContextLevelAlias[]}
	 */
	get aliases(){
		return [...BASENAME_ALIASES_MAP[NUM_BASENAME_MAP[this._number]]];
	}
    
    /**
     * All the level's valid names in alphabetical order. This includes the
     * level's name as used in the Moodle source code, the level's base name,
     * and all the level's aliases.
     *
     * @type {string[]}
     */
    get names(){
        return [
			this.name,
			this.baseName,
			...this.aliases
		].sort();
    }
    
    /**
     * Create a new Moodle context level object representing the same context
     * level.
     *
     * @return {MoodleContextLevel}
     */
    clone(){
        return new MoodleContextLevel(this._number);
    }
    
    /**
     * The context level as a string consisting of the name followed by a space
     * then the level number in parentheses, e.g. `SYSTEM (10)`.
     *
     * @return {string}
     */
    toString(){
        return `${this.name} (${this.number})`;
    }
    
    /**
     * The version as a plain object indexed by:
     *
     * * `name`
     * * `number`
     * * `baseName`
     * * `aliases`
     *
     * @return {Object}
     */
    toObject(){
        return {
            name: this.name,
            number: this.number,
            baseName: this.baseName,
            aliases: this.aliases
        };
    }
    
    /**
     * Test if a given value is a Moodle context level object representing the
     * same context level.
     *
     * @param {*} val
     * @return {boolean}
     */
    equals(val){
        return MoodleContextLevel.compare(this, val) === 0 ? true : false;
    }
    
    /**
     * Compare this context level to another.
     *
     * @param {MoodleContextLevel} mv
     * @return {number} `-1` returned if passed context level is lesser, `0` if
     * the passed context level is the same, and `1` if the passed context level
     * is greater. If the passed value is not a Moodle context level object,
     * `NaN` will be returned.
     */
    compareTo(mv){
        return MoodleContextLevel.compare(mv, this);
    }
}

// add dynamically created properties for each context to class
for(const n of MoodleContextLevel.allNames){
	Object.defineProperty(MoodleContextLevel, n, {
		get: function(){
			return new MoodleContextLevel(n);
		}
	});
}

export default MoodleContextLevel;