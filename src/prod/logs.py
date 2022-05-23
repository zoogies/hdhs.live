# imports
from datetime import datetime

# class declaration
class logmaker:
    # initialize our class
    def __init__(self, mode):
        # get current time
        now = datetime.now()
        # format current time
        dt_string = now.strftime("%m/%d/%Y %H:%M:%S")

        # assign our log file to be a new file with the stamp of the datetime
        # if we stamp our log with just the date
        if mode == "daily":
            # stamp with just date
            filename = (
                "logs/log("
                + str(datetime.now().strftime("%m/%d/%Y").replace("/", "_"))
                + ").txt"
            )
        else:
            # stamp with full label
            filename = (
                "logs/log("
                + str(datetime.now().strftime("%m/%d/%Y %H:%M:%S").replace("/", "_"))
                + ").txt"
            )

        # open our file with the filename we generated
        self.file = open(filename, "a+")

    # function to log an event to our file
    def log(self, event, ip):
        # get our current time
        now = datetime.now()
        dt_string = now.strftime("%m/%d/%Y %H:%M:%S")

        # create string of what we want to write containing our ip and event with a timestamp
        line = str(dt_string) + " - " + str(ip) + " - " + str(event)
        # write our event to the file
        self.file.writelines(line + "\n")
