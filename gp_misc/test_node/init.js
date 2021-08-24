// mongo query and options

core.options = {}
core.options.query = {}

options = {'_id':0}
options[context.node.settings.lookup_key_field] = 1
options[context.node.settings.lookup_copy_field] = 1

core.options.options = options
