# bname

AI-powered git branch name generator based on your changes. Inspired by [opencommit](https://github.com/di-sukharev/opencommit).

## Installation

```bash
npm install -g bname
```

## Usage

### Quick Start

Simply run `bname` in your git repository:

```bash
bname
```

This will:
1. Analyze your git diff (staged, unstaged, and untracked files)
2. Generate a branch name using AI
3. Prompt you to confirm or edit the name
4. Create and switch to the new branch

### Commands

#### Create a new branch
```bash
bname create
# or
bname c

# Skip confirmation prompt
bname create --yes
# or
bname create -y

# Use a specific AI model
bname create --model claude-3-haiku-20240307
```

#### Configuration
```bash
# List all configuration
bname config list

# Get a specific configuration value
bname config get model

# Set configuration values
bname config set openaiApiKey YOUR_API_KEY
bname config set anthropicApiKey YOUR_API_KEY
bname config set model gpt-4
bname config set emoji true
bname config set maxLength 60
```

## Configuration

bname can be configured through multiple sources (in order of precedence):

1. Environment variables
2. Local config file (`.bname-config.json` in project root)
3. Global config file (`~/.bname-config.json`)
4. Default values

### Environment Variables

- `OPENAI_API_KEY` - OpenAI API key
- `ANTHROPIC_API_KEY` - Anthropic API key
- `BNAME_MODEL` - AI model to use
- `BNAME_LANGUAGE` - Language for branch names (default: en)
- `BNAME_EMOJI` - Include emojis in branch names (default: false)
- `BNAME_MAX_LENGTH` - Maximum branch name length (default: 50)

### Supported Models

#### OpenAI
- `gpt-4o-mini` (default)
- `gpt-4o`
- `gpt-4`
- `gpt-3.5-turbo`

#### Anthropic
- `claude-3-haiku-20240307`
- `claude-3-sonnet-20240229`
- `claude-3-opus-20240229`

## Branch Name Format

Generated branch names follow these conventions:
- Type prefix: `feature/`, `fix/`, `refactor/`, `docs/`, `test/`, `chore/`
- Lowercase letters, numbers, hyphens, and forward slashes only
- Descriptive but concise (max 50 characters by default)
- Hyphens to separate words

Example: `feature/add-user-authentication`

## License

ISC