#!/bin/bash

# Function to create feature structure
create_feature() {
    local feature_name=$1
    local sub_feature=$2
    local feature_path="src/features/$feature_name"
    
    if [ -n "$sub_feature" ]; then
        feature_path="$feature_path/$sub_feature"
    fi
    
    # Create main feature directory and its subdirectories
    mkdir -p "$feature_path/components"
    
    # Create feature files
    touch "$feature_path/index.ts"
    touch "$feature_path/routes.tsx"
    touch "$feature_path/types.ts"
    touch "$feature_path/api.ts"
    touch "$feature_path/utils.ts"
    touch "$feature_path/hooks.ts"
    touch "$feature_path/components/index.ts"
    
    # Add basic content to index.ts
    echo "export * from './routes';" > "$feature_path/index.ts"
    
    # Add basic content to routes.tsx
    cat > "$feature_path/routes.tsx" << EOL
import { Route } from 'react-router-dom';

export const ${feature_name}${sub_feature:+${sub_feature^}}Routes = () => {
  return (
    <>
      {/* Add your routes here */}
    </>
  );
};
EOL

    # Add basic content to types.ts
    cat > "$feature_path/types.ts" << EOL
// Add your feature-specific types here
export interface ${feature_name}${sub_feature:+${sub_feature^}}State {
  // Define your state types
}
EOL

    # Add basic content to api.ts
    cat > "$feature_path/api.ts" << EOL
import { api } from '@/shared/api';

// Add your feature-specific API calls here
export const ${feature_name}${sub_feature:+${sub_feature^}}Api = {
  // Define your API methods
};
EOL

    # Add basic content to utils.ts
    cat > "$feature_path/utils.ts" << EOL
// Add your feature-specific utilities here
export const ${feature_name}${sub_feature:+${sub_feature^}}Utils = {
  // Define your utility functions
};
EOL

    # Add basic content to hooks.ts
    cat > "$feature_path/hooks.ts" << EOL
// Add your feature-specific hooks here
export const use${feature_name^}${sub_feature:+${sub_feature^}} = () => {
  // Define your hooks
  return {};
};
EOL

    # Add basic content to components/index.ts
    echo "// Export your components here" > "$feature_path/components/index.ts"
    
    echo "Created feature: $feature_name${sub_feature:+"/$sub_feature"}"
    echo "Feature path: $feature_path"
    echo "Created structure:"
    echo "  ├── index.ts"
    echo "  ├── routes.tsx"
    echo "  ├── types.ts"
    echo "  ├── api.ts"
    echo "  ├── utils.ts"
    echo "  ├── hooks.ts"
    echo "  └── components/"
    echo "      └── index.ts"
}

# Function to create a component
create_component() {
    local feature_name=$1
    local sub_feature=$2
    local component_name=$3
    local component_path="src/features/$feature_name"
    
    if [ -n "$sub_feature" ]; then
        component_path="$component_path/$sub_feature"
    fi
    
    component_path="$component_path/components/$component_name"
    
    # Create component directory
    mkdir -p "$component_path"
    
    # Create component files
    touch "$component_path/$component_name.tsx"
    # touch "$component_path/$component_name.test.tsx"
    touch "$component_path/index.ts"
    
    # Add basic content to component file
    cat > "$component_path/$component_name.tsx" << EOL
import React from 'react';

interface ${component_name}Props {
  // Add your props here
}

export const ${component_name}: React.FC<${component_name}Props> = () => {
  return (
    <div>
      {/* Add your component content here */}
    </div>
  );
};
EOL

    # Add basic content to test file
    cat > "$component_path/$component_name.test.tsx" << EOL
import { render, screen } from '@testing-library/react';
import { ${component_name} } from './${component_name}';

describe('${component_name}', () => {
  it('renders correctly', () => {
    render(<${component_name} />);
    // Add your tests here
  });
});
EOL

    # Add basic content to index.ts
    echo "export * from './$component_name';" > "$component_path/index.ts"
    
    # Update components/index.ts to export the new component
    local components_index_path="src/features/$feature_name"
    if [ -n "$sub_feature" ]; then
        components_index_path="$components_index_path/$sub_feature"
    fi
    components_index_path="$components_index_path/components/index.ts"
    
    echo "export * from './$component_name';" >> "$components_index_path"
    
    echo "Created component: $component_name"
    echo "Component path: $component_path"
    echo "Created files:"
    echo "  ├── $component_name.tsx"
    # echo "  ├── $component_name.test.tsx"
    echo "  └── index.ts"
}

# Main script logic
if [ "$1" = "feature" ]; then
    if [ -z "$2" ]; then
        echo "Error: Feature name is required"
        echo "Usage: ./create-feature.sh feature feature_name [sub_feature_name]"
        exit 1
    fi
    create_feature "$2" "$3"
elif [ "$1" = "component" ]; then
    if [ -z "$2" ]; then
        echo "Error: Feature name is required"
        echo "Usage: ./create-feature.sh component feature_name [sub_feature_name] component_name"
        exit 1
    fi
    
    # If we have exactly 3 arguments, treat as feature/component
    if [ -n "$3" ] && [ -z "$4" ]; then
        create_component "$2" "" "$3"
    # If we have 4 arguments, treat as feature/sub-feature/component
    elif [ -n "$3" ] && [ -n "$4" ]; then
        create_component "$2" "$3" "$4"
    else
        echo "Error: Component name is required"
        echo "Usage: ./create-feature.sh component feature_name [sub_feature_name] component_name"
        exit 1
    fi
else
    echo "Usage:"
    echo "  To create a feature: ./create-feature.sh feature feature_name [sub_feature_name]"
    echo "  To create a component: ./create-feature.sh component feature_name [sub_feature_name] component_name"
    exit 1
fi 