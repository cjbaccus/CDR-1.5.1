# CDR-1.5.1

This program is written specifically to work within the Kirix Strata applicaiton as an extension.
It was designed to provide a functional Call Detail Record generation from the huge Cisco Communications Manager CDR dump.
The current iteration works specifically with 8.X through 9.x.  Will have to test with any version 10.x and above.
## Following Features are built in:
* Parse large CDR to something more usable
* Delete first 'header' row
* Create International table for Inbound
* Create International table for NANP
* Create International table for outbound

---

## Things to do

* Add all proper columns for reporting to each of the tables generated
* Figure out how to do summarized reports to dump straight to a table in kirix.
* Build in relationships on the database from the base script.
* Add in Country codes and area codes db as part of extension