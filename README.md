# Ory possible validation bug

Validation of trait where I defined validation like minLength or pattern always results in 4000001 = ErrorValidationGeneric. 
According to https://www.ory.sh/docs/kratos/concepts/ui-user-interface#ui-message-codes 
and https://github.com/ory/kratos/blob/master/text/id.go I would expect a 4000003 = ErrorValidationMinLength
if I defined a minLength for a given trait in json schema.
