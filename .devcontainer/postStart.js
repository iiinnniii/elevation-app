import { execSync } from 'child_process';

// Helper function to run shell commands and log output
function runCommand(command, successMessage, errorMessage) {
	try {
		execSync(command, { stdio: 'inherit' });
		if (successMessage) {
			console.log(successMessage);
		}
	} catch (error) {
		switch (errorMessage) {
			case null: {
				break;
			}
			case undefined: {
				console.error(error);
				break;
			}
			default: {
				console.error(errorMessage);
				break;
			}
		}
	}
}

console.log('Starting postStart tasks...');

// 1. Configure git settings
runCommand(
	'git config --global core.autocrlf input',
	'Git config completed successfully',
	'\x1b[31mError: Git config failed\x1b[0m',
);

// 2. Install dependencies if `pnpm-lock.yaml` exists
runCommand(`
    if [ -f pnpm-lock.yaml ]; then
        pnpm install
        EXIT_CODE=$?
        if [ $EXIT_CODE -eq 0 ]; then
            echo "pnpm install was successful"
        else
            echo "\x1b[31mError: pnpm install failed\x1b[0m" >&2
        fi
    else
        echo "\x1b[33mWarning: pnpm-lock.yaml not found, skipping pnpm install\x1b[0m"
    fi
`);

// 3. Handle SSH key copy
runCommand(`
    if [ -f /mnt/ssh_keys/id_rsa ]; then
        sudo cp /mnt/ssh_keys/id_rsa /root/.ssh
        EXIT_CODE=$?
        if [ $EXIT_CODE -eq 0 ]; then
            echo "SSH key copied to /root/.ssh/id_rsa"
        else
            echo "\x1b[31mError: Failed to copy SSH key to /root/.ssh/id_rsa\x1b[0m" >&2
        fi
    else
        echo "\x1b[33mWarning: SSH key not found, skipping copy\x1b[0m"
    fi
`);

// 4. Handle CA certificate copy
runCommand(`
    if [ -f /mnt/ca_certificates/rootCA.crt ]; then 
        # Copy operation
        sudo cp /mnt/ca_certificates/rootCA.crt /usr/local/share/ca-certificates
        COPY_EXIT_CODE=$?
        if [ $COPY_EXIT_CODE -eq 0 ]; then
            echo "CA certificate copied to /usr/local/share/ca-certificates/rootCA.crt"
        else
            echo "\x1b[31mError: Failed to copy CA certificate to /usr/local/share/ca-certificates\x1b[0m" >&2
        fi
        # Update operation (only runs if copy succeeded)
        if [ $COPY_EXIT_CODE -eq 0 ]; then 
            sudo update-ca-certificates
            UPDATE_EXIT_CODE=$?
            if [ $UPDATE_EXIT_CODE -eq 0 ]; then
                echo "CA certificate updated"
            else
                echo "\x1b[31mError: Failed to update CA certificates\x1b[0m" >&2
            fi
        else
            echo "\x1b[33mWarning: Copy of CA certificate failed, skipping update-ca-certificates\x1b[0m"
        fi
    else 
        echo "\x1b[33mWarning: CA certificate not found, skipping copy and update-ca-certificates\x1b[0m"
    fi
`);

// 5. Run pnpm outdated to check for outdated dependencies
runCommand(`
    if [ -f pnpm-lock.yaml ]; then
        pnpm outdated
        EXIT_CODE=$?
        if [ $EXIT_CODE -eq 0 ]; then
            echo "pnpm outdated completed successfully"
        fi
    else
        echo "\x1b[33mWarning: pnpm-lock.yaml not found, skipping pnpm outdated\x1b[0m"
    fi
`);
