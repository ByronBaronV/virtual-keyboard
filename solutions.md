# Issue: [Database setting]

## Problem Description
- Package requirements 'Flask==3.0.0', 'Werkzeug==3.0.1' are not satisfied
- Unused import statement 'current_app'
- HParameter 'e' value is not used
## Root Cause Analysis
- What was the underlying cause?
- What assumptions were incorrect?
- What dependencies were involved?
## Resolution
- How was it fixed? (or planned fix if unresolved)
- What changes were made?
- What alternatives were considered?
## Prevention
- How can similar issues be prevented?
- What lessons were learned?
- What warning signs should be watched for?

# Issue: [base.html setting]

## Problem Description
- Error: Unexpected tokens (3)
## Root Cause Analysis
- What was the underlying cause?
- What assumptions were incorrect?
- What dependencies were involved?
## Resolution
- How was it fixed? (or planned fix if unresolved)
- What changes were made?
- What alternatives were considered?
## Prevention
- How can similar issues be prevented?
- What lessons were learned?
- What warning signs should be watched for?

# Issue: [Audio files not available]
## Problem Description
- The audio files were supposed to be at the URL: https://tonejs.github.io/audio/salamander/, 
- The link above leads to a 404 file not found status.
## Root Cause Analysis
- Piano samples URLs might be unreachable
## Resolution
- Tried with the URL (in line 71): https://github.com/pimoroni/python-multitouch/blob/master/examples/piano.py
- Also found: https://tonejs.github.io/ but still have to know how to use/implement it.
- Modify the piano sampler. Claude suggest to use a locally hosted smaller sample.
- ## Prevention
- Ho?
- 
# Issue: [<!DOCTYPE html> (unexpected tokens)]
## Problem Description
- '<!DOCTYPE html>' appears as the only error.
## Root Cause Analysis
- Piano samples URLs might be unreachable
## Resolution
- Research on the web and found some interesting sites but the offered solutions were more confusing.
- https://stackoverflow.com/questions/31529446/unexpected-token-in-first-line-of-html was helpful.
- But since I read that it was a syntax solution, I accidentally solved it after deleting the '< >' symbols.
- ## Prevention

# Issue: [Flash messages are not displayed]
## Problem Description
- There's no description in the file, but the messages don't appear in the frontend.
## Root Cause Analysis
- The flash message rendering code is included after the <body> tag.
- The secret key for the Flask application is correctly included.
- The code for rediection is correct 'return redirect(url_for('sounds'))'
- 
## Resolution
- Research on the web anleting the '< >' symbols.
- ## Prevention