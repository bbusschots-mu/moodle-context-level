// NOTE:
// =====
// This test suite assumes that the module @maynoothuniversity/mu-qunit-util is
// available as a global variable named util.

//
//=== The Tests ================================================================
//

QUnit.module('Static Read-only Properties', {}, function(){
	QUnit.test('.names', function(a){
		a.expect(2);
		
		// make sure an array of strings is returned
		const n = MoodleContextLevel.names;
		a.ok(is.all.string(n) && is.not.empty(n), 'is an array of strings');
		
		// make sure each returned value is not a reference to the same array
		const n1 = MoodleContextLevel.names;
		const n2 = MoodleContextLevel.names;
		a.notStrictEqual(n1, n2, 'a new array is returned on each access');
	});
	
	QUnit.test('.baseNames', function(a){
		a.expect(2);
		
		// make sure an array of strings is returned
		const n = MoodleContextLevel.baseNames;
		a.ok(is.all.string(n) && is.not.empty(n), 'is an array of strings');
		
		// make sure each returned value is not a reference to the same array
		const n1 = MoodleContextLevel.baseNames;
		const n2 = MoodleContextLevel.baseNames;
		a.notStrictEqual(n1, n2, 'a new array is returned on each access');
	});
	
	QUnit.test('.allNames', function(a){
		a.expect(2);
		
		// make sure an array of strings is returned
		const n = MoodleContextLevel.allNames;
		a.ok(is.all.string(n) && is.not.empty(n), 'is an array of strings');
		
		// make sure each returned value is not a reference to the same array
		const n1 = MoodleContextLevel.allNames;
		const n2 = MoodleContextLevel.allNames;
		a.notStrictEqual(n1, n2, 'a new array is returned on each access');
	});
	
	QUnit.test('.levelNumbers', function(a){
		a.expect(2);
		
		// make sure an array of numbers is returned
		const n = MoodleContextLevel.levelNumbers;
		a.ok(is.all.number(n) && is.not.empty(n), 'is an array of numbers');
		
		// make sure each returned value is not a reference to the same array
		const n1 = MoodleContextLevel.levelNumbers;
		const n2 = MoodleContextLevel.levelNumbers;
		a.notStrictEqual(n1, n2, 'a new array is returned on each access');
	});
	
	QUnit.test('.levels', function(a){
		a.expect(2);
		
		// make sure an array of context level obejcts is returned
		const l = MoodleContextLevel.levels;
		let allRightPrototype = true;
		for(const lObj of l){
			if(!(lObj instanceof MoodleContextLevel)){
				allRightPrototype = false;
				break;
			}
		}
		a.ok(is.all.object(l) && is.not.empty(l) && allRightPrototype, 'is an array of context level objects');
		
		// make sure each returned value is not a reference to the same array
		const l1 = MoodleContextLevel.levels;
		const l2 = MoodleContextLevel.levels;
		a.notStrictEqual(l1, l2, 'a new array is returned on each access');
	});
	
	// test the dynamically created getters for each valid level
	for(const n of MoodleContextLevel.allNames){
		QUnit.test(`dynamic .${n} property`, function(a){
			a.expect(2);
		
			// make sure a ontext level obejct is returned
			a.ok(MoodleContextLevel[n] instanceof MoodleContextLevel, 'is a context level object');
		
			// make sure each returned value is not a reference to the same object
			const l1 = MoodleContextLevel[n];
			const l2 = MoodleContextLevel[n];
			a.notStrictEqual(l1, l2, 'a new object is returned on each access');
		});
	}
});

QUnit.module('Static Validation Functions', {}, function(){
    QUnit.test('isContextLevelNumber()', function(a){
        const mustAlwaysReturnFalse = [
            ...util.dummyDataExcept([], ['integer']),
            util.dummyData('number.integer.negative'),
            util.dummyData('string.integer.negative')
            
        ];
        a.expect((mustAlwaysReturnFalse.length * 2) + 5);
        
        // make sure the function actually exists
        a.ok(is.function(MoodleContextLevel.isContextLevelNumber), 'function exists');
        
        // make sure values that should always return false do so in both modes
        for(const dd of mustAlwaysReturnFalse){
            a.strictEqual(MoodleContextLevel.isContextLevelNumber(dd.value, false), false, `${dd.description} returns false without strict type checking`);
            a.strictEqual(MoodleContextLevel.isContextLevelNumber(dd.value, true), false, `${dd.description} returns false with strict type checking`);
        }
        
        // make sure values that are always correct return true in both modes
        a.strictEqual(MoodleContextLevel.isContextLevelNumber(10, false), true, '10 returns true without strict type checking');
        a.strictEqual(MoodleContextLevel.isContextLevelNumber(10, true), true, '10 returns true with strict type checking');
        
        // make sure valid strings are only accepted when strict mode is disabled
        a.strictEqual(MoodleContextLevel.isContextLevelNumber('10', false), true, "'10' returns true without strict type checking");
        a.strictEqual(MoodleContextLevel.isContextLevelNumber('10', true), false, "'10' returns false with strict type checking");
    });
    
    QUnit.test('isContextLevelName()', function(a){
        const mustAlwaysReturnFalse = [
            ...util.dummyDataExcept([], ['string']),
			'CONTEXT_BOGUS'
        ];
        a.expect((mustAlwaysReturnFalse.length * 2) + 9);
        
        // make sure the function actually exists
        a.ok(is.function(MoodleContextLevel.isContextLevelName), 'function exists');
        
        // make sure values that should always return false do so in both modes
        for(const dd of mustAlwaysReturnFalse){
            a.strictEqual(MoodleContextLevel.isContextLevelName(dd.value, false), false, `${dd.description} returns false without strict type checking`);
            a.strictEqual(MoodleContextLevel.isContextLevelName(dd.value, true), false, `${dd.description} returns false with strict type checking`);
        }
        
        // make sure values that are always correct return true in both modes
        a.strictEqual(MoodleContextLevel.isContextLevelName('CONTEXT_SYSTEM', false), true, "'CONTEXT_SYSTEM' returns true without strict type checking");
        a.strictEqual(MoodleContextLevel.isContextLevelName('CONTEXT_SYSTEM', true), true, "'CONTEXT_SYSTEM' returns true with strict type checking");
        
        // make sure altered case and alternative names are only accepted when strict mode is disabled
        a.strictEqual(MoodleContextLevel.isContextLevelName('context_system', false), true, "'context_system' returns true without strict type checking");
        a.strictEqual(MoodleContextLevel.isContextLevelName('context_system', true), false, "'context_system' returns false with strict type checking");
		a.strictEqual(MoodleContextLevel.isContextLevelName('system', false), true, "'system' returns true without strict type checking");
        a.strictEqual(MoodleContextLevel.isContextLevelName('system', true), false, "'system' returns false with strict type checking");
		a.strictEqual(MoodleContextLevel.isContextLevelName('category', false), true, "'category' returns true without strict type checking");
        a.strictEqual(MoodleContextLevel.isContextLevelName('category', true), false, "'category' returns false with strict type checking");
    });
});

QUnit.module('Static Conversion Functions', {}, function(){    
    QUnit.test('numberFromName()', function(a){
        const mustReturnNaN = [
            ...util.dummyDataExcept([], ['string']),
			'CONTEXT_BOGUS'
        ];
        a.expect(mustReturnNaN.length + 4);
        
        // make sure the function actually exists
        a.ok(is.function(MoodleContextLevel.numberFromName), 'function exists');
        
        // make sure the data that should return NaN does
        for(const dd of mustReturnNaN){
            a.ok(is.nan(MoodleContextLevel.numberFromName(dd.value)), `${dd.description} returns NaN`);
        }
        
        // make sure valid data returns as expected
        a.strictEqual(MoodleContextLevel.numberFromName('CONTEXT_SYSTEM'), 10, "'CONTEXT_SYSTEM' converts to 10");
		a.strictEqual(MoodleContextLevel.numberFromName('system'), 10, "'system' converts to 10");
		a.strictEqual(MoodleContextLevel.numberFromName('category'), 40, "'category' converts to 40");
    });
});

QUnit.module('constructor', function(){
    QUnit.test('class exists', function(a){
        a.expect(1);
        a.ok(is.function(MoodleContextLevel));
    });
    
    QUnit.test('default constructor', function(a){
        a.expect(1);
        a.strictEqual((new MoodleContextLevel()).toString(), 'CONTEXT_SYSTEM (10)');
    });
    
    QUnit.test('argument processing', function(a){
        const mustThrowTypeError = [
            ...util.dummyBasicDataExcept('string', 'number', 'object', 'other')
        ];
		const mustThrowRangeError = [
			util.dummyData('string.empty'),
			...util.dummyDataWithAllTags('integer', 'negative'),
			...util.dummyDataWithAllTags('zero')
        ];
        a.expect(mustThrowTypeError.length + mustThrowRangeError.length + 5);
        
        // make sure that types that should throw an error do
        for(const dd of mustThrowTypeError){
            a.throws(
                ()=>{ new MoodleContextLevel(dd.value); },
                TypeError,
                `${dd.description} throws Type Error`
            );
        }
		
		// make sure values that should throw an error do
		for(const dd of mustThrowRangeError){
            a.throws(
                ()=>{ new MoodleContextLevel(dd.value); },
                RangeError,
                `${dd.description} throws Range Error`
            );
        }
        
		// make sure valid numbers are accepted
		a.strictEqual((new MoodleContextLevel(10)).number, 10, 'can initialise from valid integer');
		a.strictEqual((new MoodleContextLevel('10')).number, 10, 'can initialise from valid integer as string');
		
        // make sure valid names are accepted
        a.strictEqual((new MoodleContextLevel('CONTEXT_SYSTEM')).number, 10, 'can initialise from name');
		a.strictEqual((new MoodleContextLevel('system')).number, 10, 'can initialise from base name');
		a.strictEqual((new MoodleContextLevel('category')).number, 40, 'can initialise from alias');
    });
});

QUnit.module('Getters & Setters', function(){
    QUnit.test('.number', function(a){
        // data that must throw errors
        const mustThrowTypeError = [
            ...util.dummyDataExcept([], ['integer', 'string']),
        ];
		const mustThrowRangeError = [
			util.dummyData('number.zero'),
			util.dummyData('string.zero'),
            ...util.dummyDataWithAllTags('integer', 'negative'),
            ...util.dummyDataWithAnyTag('digit'),
            ...util.dummyDataWithAnyTag('3digit')
        ];
        
        // set the number of expected tests
        a.expect(mustThrowTypeError.length + mustThrowRangeError.length + 3);
        
        // make sure the setter throws an error when needed
        for(const dd of mustThrowTypeError){
            a.throws(
                ()=>{
                    const cl = new MoodleContextLevel();
                    cl.number = dd.value;
                },
                TypeError,
                `.number throws a type error when attempting to set to ${dd.description}`
            );
        }
		for(const dd of mustThrowRangeError){
            a.throws(
                ()=>{
                    const cl = new MoodleContextLevel();
                    cl.number = dd.value;
                },
                RangeError,
                `.number throws a rangeerror when attempting to set to ${dd.description}`
            );
        }
        
        // make sure setting a valid number does not throw an error and that the value gets correctly set
		const cl = new MoodleContextLevel();
		cl.number = 50;
		a.strictEqual(cl.number, 50, `number successfully set to 50`);
		cl.number = '50';
		a.strictEqual(cl.number, 50, `number successfully set to '50'`);
      
        // make sure an unknown context level fails to  set
        a.throws(
            ()=>{
                cl.number = 20;
            },
            RangeError,
            'attempting to set number to 20 which is not a defined context level throws a range error'
        );
    });
	
	QUnit.test('.name', function(a){
        // data that must throw errors
        const mustThrowTypeError = [
            ...util.dummyBasicDataExcept('integer', 'string'),
        ];
        
        // set the number of expected tests
        a.expect(mustThrowTypeError.length + 4);
        
        // make sure the setter throws an error when needed
        for(const dd of mustThrowTypeError){
            a.throws(
                ()=>{
                    const cl = new MoodleContextLevel();
                    cl.name = dd.value;
                },
                TypeError,
                `.name throws a type error when attempting to set to ${dd.description}`
            );
        }
        a.throws(
            ()=>{
                const cl = new MoodleContextLevel();
                cl.name = 'CONTEXT_BOGUS';
            },
            RangeError,
            `.name throws a range error when attempting to set to an unknown name`
        );
        
        // make sure setting a valid name does not throw an error and that the value gets correctly set
		const cl = new MoodleContextLevel();
		cl.name = 'CONTEXT_COURSE';
		a.strictEqual(cl.number, 50, `.name successfully set to 'CONTEXT_COURSE'`);
		cl.name = 'course';
		a.strictEqual(cl.number, 50, `.name successfully set to 'course'`);
		cl.name = 'category';
		a.strictEqual(cl.number, 40, `.name successfully set to 'category'`);
    });
});

QUnit.module('Object Utility Functions', function(){
    QUnit.test('.clone()', function(a){
		a.expect(4);
		
        // make sure the function actually exists
        a.ok(is.function(MoodleContextLevel.prototype.clone), 'function exists');
        
        // make sure the clone really is a clone object
        let cl = new MoodleContextLevel();
        let clc = cl.clone();
        a.ok(clc instanceof MoodleContextLevel, 'clone is a MoodleContextLevel object');
        a.notStrictEqual(cl, clc, 'the clone is not a reference to the original');
        
        // make sure all values get coppied
        cl = new MoodleContextLevel(50);
        clc = cl.clone();
        a.strictEqual(cl._number, clc._number, `property _number coppied correctly`);
    });
    
    QUnit.test('.toString()', function(a){
        a.expect(3);
        
        // make sure the function actually exists
        a.ok(is.function(MoodleContextLevel.prototype.toString), 'function exists');
        
        // make sure the function returns a string
        let cl = new MoodleContextLevel(50);
        a.ok(is.string(cl.toString()), 'returns a string');
                
        // make sure the string has the expected format
        a.strictEqual(cl.toString(), 'CONTEXT_COURSE (50)', 'string has expected format');
    });
    
    QUnit.test('.toObject()', function(a){
        a.expect(3);
        
        // make sure the function actually exists
        a.ok(is.function(MoodleContextLevel.prototype.toObject), 'function exists');
        
        // make sure the function returns an object
        let cl = new MoodleContextLevel();
        a.ok(is.object(cl.toObject()), 'returns an object');
        
        // make sure the function returns the expected values
        cl = new MoodleContextLevel(40);
        a.deepEqual(
            cl.toObject(),
            {
                name: `CONTEXT_COURSECAT`,
                number: 40,
                baseName: 'coursecat',
                aliases: ['courseCategory', 'category']
            },
            'expected values returned'
        );
    });
});

QUnit.module('comparison methods', function(){
    QUnit.test('compare()', function(a){
        const mustReturnNaN = [
            ...util.dummyBasicData()
        ];
        a.expect((mustReturnNaN.length * 2) + 5);
        
		// make sure the function actually exists
        a.ok(is.function(MoodleContextLevel.compare), 'function exists');
        
        // make sure everything that must result in NaN does when used as either argument
        const cl = new MoodleContextLevel();
        for(const dd of mustReturnNaN){
            a.ok(is.nan(MoodleContextLevel.compare(dd.value, cl)), `${dd.description} as val1 returns NaN`);
            a.ok(is.nan(MoodleContextLevel.compare(cl, dd.value)), `${dd.description} as val2 returns NaN`);
        }
        
        // check that equality is properly detected
        a.strictEqual(MoodleContextLevel.compare(new MoodleContextLevel(), new MoodleContextLevel()), 0, 'two default context levels are considered equal');
        a.strictEqual(MoodleContextLevel.compare(new MoodleContextLevel(50), new MoodleContextLevel(50)), 0, 'two objects representing the same context level are considered equal');
        
        // check when levels differ
        let cl1 = new MoodleContextLevel(40);
        let cl2 = new MoodleContextLevel(50);
        a.strictEqual(MoodleContextLevel.compare(cl1, cl2), -1, 'val1 with lower number than val2 returns -1');
        a.strictEqual(MoodleContextLevel.compare(cl2, cl1), 1, 'val1 with higher number than val2 returns 1');
    });
    
    QUnit.test('.equals()', function(a){
        const mustReturnFalse = [
            ...util.dummyBasicData()
        ];
        a.expect(mustReturnFalse.length + 5);
        
        // make sure the function actually exists
        a.ok(is.function(MoodleContextLevel.prototype.equals), 'function exists');
        
        // make sure values other than context level objects return false
        const cl = new MoodleContextLevel();
        for(const dd of mustReturnFalse){
            a.strictEqual(cl.equals(dd.val), false, `${dd.description} returns false`);
        }
        
        // make sure equal versions return true
		const cl1 = new MoodleContextLevel(50);
        a.strictEqual(cl.equals(new MoodleContextLevel()), true, 'a default context level is considered equal to another default context level');
        a.strictEqual(cl1.equals(cl1.clone()), true, 'a clone is considered equal to the original');
        a.strictEqual(cl1.equals(new MoodleContextLevel(50)), true, 'two context levels with the same number are considered equal');
        
        // make sure differing versions return false
        a.strictEqual(cl1.equals(new MoodleContextLevel(10)), false, 'two context levels with different numbers are not considered equal');
    });
    
    QUnit.test('.compareTo()', function(a){
        const mustReturnNaN = [
            ...util.dummyBasicData()
        ];
        a.expect(mustReturnNaN.length + 4);
        
        // make sure the function actually exists
        a.ok(is.function(MoodleContextLevel.prototype.compareTo), 'function exists');
        
        // make sure values other than context level objects return NaN
        const cl = new MoodleContextLevel(50);
        for(const dd of mustReturnNaN){
            a.ok(is.nan(cl.compareTo(dd.val)), `${dd.description} returns NaN`);
        }
        
        // make sure an equal level returns 0
        a.strictEqual(cl.compareTo(new MoodleContextLevel(50)), 0, 'an equal level returns 0');
        
        // make sure lesser levels return -1
        a.strictEqual(cl.compareTo(new MoodleContextLevel(10)), -1, 'lower level returns -1');
        
        // make sure greater levels return 1
        a.strictEqual(cl.compareTo(new MoodleContextLevel(80)), 1, 'higher level returns 1');
    });
});

QUnit.module('static parsing methods', function(){
    QUnit.test('parse()', function(a){
        const mustThrowTypeError = [
            ...util.dummyBasicDataExcept('string', 'number', 'other')
        ];
		const mustThrowRangeError = [
            ...util.dummyDataWithAnyTag('string', 'float', 'negative', 'zero')
        ];
		a.expect(mustThrowTypeError.length + mustThrowRangeError.length + 9);

        // make sure the function actually exists
        a.ok(is.function(MoodleContextLevel.parse), 'function exists');
        
        // make sure data that should throw an error does
        for(const dd of mustThrowTypeError){
            a.throws(
                ()=>{ MoodleContextLevel.parse(dd.value); },
                TypeError,
                `${dd.description} throws a type error`
            );
        }
		for(const dd of mustThrowRangeError){
            a.throws(
                ()=>{ MoodleContextLevel.parse(dd.value); },
                RangeError,
                `${dd.description} throws a type error`
            );
        }
        
		// make sure valid values are properly parsed
		let cl1 = new MoodleContextLevel(40);
		a.ok(cl1.equals(MoodleContextLevel.parse(40)), 'number as number successfully parsed');
		a.ok(cl1.equals(MoodleContextLevel.parse('40')), 'number as string successfully parsed');
		a.ok(cl1.equals(MoodleContextLevel.parse('CONTEXT_COURSECAT')), 'name in correct case successfully parsed');
		a.ok(cl1.equals(MoodleContextLevel.parse('context_courseCat')), 'name in incorrect case successfully parsed');
		a.ok(cl1.equals(MoodleContextLevel.parse('coursecat')), 'base name in correct case successfully parsed');
		a.ok(cl1.equals(MoodleContextLevel.parse('courseCat')), 'base name in incorrect case successfully parsed');
		a.ok(cl1.equals(MoodleContextLevel.parse('category')), 'alias in correct case successfully parsed');
		a.ok(cl1.equals(MoodleContextLevel.parse('CATEGORY')), 'alias in incorrect case successfully parsed');
    });
	
	QUnit.test('parseToNumber()', function(a){
        const mustThrowTypeError = [
            ...util.dummyBasicDataExcept('string', 'number', 'other')
        ];
		const mustThrowRangeError = [
            ...util.dummyDataWithAnyTag('string', 'float', 'negative', 'zero')
        ];
		a.expect(mustThrowTypeError.length + mustThrowRangeError.length + 9);

        // make sure the function actually exists
        a.ok(is.function(MoodleContextLevel.parseToNumber), 'function exists');
        
        // make sure data that should throw an error does
        for(const dd of mustThrowTypeError){
            a.throws(
                ()=>{ MoodleContextLevel.parseToNumber(dd.value); },
                TypeError,
                `${dd.description} throws a type error`
            );
        }
		for(const dd of mustThrowRangeError){
            a.throws(
                ()=>{ MoodleContextLevel.parseToNumber(dd.value); },
                RangeError,
                `${dd.description} throws a type error`
            );
        }
        
		// make sure valid values are properly parsed
		a.strictEqual(MoodleContextLevel.parseToNumber(40), 40, 'number as number successfully parsed');
		a.strictEqual(MoodleContextLevel.parseToNumber('40'), 40, 'number as string successfully parsed');
		a.strictEqual(MoodleContextLevel.parseToNumber('CONTEXT_COURSECAT'), 40, 'name in correct case successfully parsed');
		a.strictEqual(MoodleContextLevel.parseToNumber('Context_CourseCat'), 40, 'name in incorrect case successfully parsed');
		a.strictEqual(MoodleContextLevel.parseToNumber('coursecat'), 40, 'base name in correct case successfully parsed');
		a.strictEqual(MoodleContextLevel.parseToNumber('courseCat'), 40, 'base name in incorrect case successfully parsed');
		a.strictEqual(MoodleContextLevel.parseToNumber('category'), 40, 'alias in correct case successfully parsed');
		a.strictEqual(MoodleContextLevel.parseToNumber('CATEGORY'), 40, 'alias in incorrect case successfully parsed');
    });
	
	QUnit.test('parseToName()', function(a){
        const mustThrowTypeError = [
            ...util.dummyBasicDataExcept('string', 'number', 'other')
        ];
		const mustThrowRangeError = [
            ...util.dummyDataWithAnyTag('string', 'float', 'negative', 'zero')
        ];
		a.expect(mustThrowTypeError.length + mustThrowRangeError.length + 9);

        // make sure the function actually exists
        a.ok(is.function(MoodleContextLevel.parseToName), 'function exists');
        
        // make sure data that should throw an error does
        for(const dd of mustThrowTypeError){
            a.throws(
                ()=>{ MoodleContextLevel.parseToName(dd.value); },
                TypeError,
                `${dd.description} throws a type error`
            );
        }
		for(const dd of mustThrowRangeError){
            a.throws(
                ()=>{ MoodleContextLevel.parseToName(dd.value); },
                RangeError,
                `${dd.description} throws a type error`
            );
        }
        
		// make sure valid values are properly parsed
		a.strictEqual(MoodleContextLevel.parseToName(40), 'CONTEXT_COURSECAT', 'number as number successfully parsed');
		a.strictEqual(MoodleContextLevel.parseToName('40'), 'CONTEXT_COURSECAT', 'number as string successfully parsed');
		a.strictEqual(MoodleContextLevel.parseToName('CONTEXT_COURSECAT'), 'CONTEXT_COURSECAT', 'name in correct case successfully parsed');
		a.strictEqual(MoodleContextLevel.parseToName('Context_CourseCat'), 'CONTEXT_COURSECAT', 'name in incorrect case successfully parsed');
		a.strictEqual(MoodleContextLevel.parseToName('coursecat'), 'CONTEXT_COURSECAT', 'base name in correct case successfully parsed');
		a.strictEqual(MoodleContextLevel.parseToName('courseCat'), 'CONTEXT_COURSECAT', 'base name in incorrect case successfully parsed');
		a.strictEqual(MoodleContextLevel.parseToName('category'), 'CONTEXT_COURSECAT', 'alias in correct case successfully parsed');
		a.strictEqual(MoodleContextLevel.parseToName('CATEGORY'), 'CONTEXT_COURSECAT', 'alias in incorrect case successfully parsed');
    });
});