# space-x-socket-server

A Socket.io server for the SpaceXSwap game for storing and validating users' interactions. This server manages real-time interactions between players and the game backend, ensuring a smooth and efficient gaming experience.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [Endpoints](#endpoints)
- [Events](#events)
- [License](#license)
- [Contributing](#contributing)
- [Bugs](#bugs)

## Installation

To set up the server, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/MakaCHOP/space-x-socket-server.git
    ```
2. Navigate to the project directory:
    ```bash
    cd space-x-socket-server
    ```
3. Install dependencies:
    ```bash
    pnpm install
    ```

## Usage

To start the server, run:

```bash
pnpm start
```

The server will start listening on port `8000`.

## Scripts

- `test`: Displays a message that no tests are specified.
- `lint`: Lints the code using `gts`.
- `clean`: Cleans the project using `gts`.
- `compile`: Compiles the TypeScript code.
- `fix`: Fixes linting issues using `gts`.
- `prepare`: Compiles the code. This is triggered automatically by `npm`.
- `pretest`: Compiles the code before running tests.
- `posttest`: Lints the code after running tests.
- `start`: Starts the server using `ts-node`.

You can run these scripts using `pnpm run <script-name>`.

## Endpoints

The server doesn't expose traditional HTTP endpoints but instead communicates through WebSocket events. However, it uses the `/api/data/get-data` endpoint to submit data to an external API.

## Events

### Client to Server Events

- `id`: Initializes a user session with the server.
    - Data: `{ id: number, energy: number, limit: number, speed: number }`
- `tap`: Records a user's tap action.
    - Data: `{ level: number }`
- `submit`: Submits the user's current data to the server.
- `disconnect`: Handles the user's disconnection.

### Server to Client Events

- `energy`: Sends the user's current energy level.
    - Data: `number`
- `top`: Sends the tap level.
    - Data: `number`

## License

This project is licensed under the terms specified in the `LICENSE` file. See `LICENSE` for details.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Create a new Pull Request.

## Bugs

If you encounter any issues, please report them on the [issue tracker](https://github.com/MakaCHOP/space-x-socket-server/issues).

## Author

Maka

## Keywords

- socket.io
- typescript
- node
- expressJS
