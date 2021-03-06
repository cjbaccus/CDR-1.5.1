
/*---------------------------------------------------------------------------

    Filename: CDR_log_import.js
    Project:  CDR Log Import Extension
    (C) Copyright 2015, SAIC.

    Summary:        Engine for CDR Log Import extenion
	REVISION: This is Version 1.5.1
	Experimental version for an international table

	
    Developer(s):  Carl Baccus
	
---------------------------------------------------------------------------*/


class CDRLogImport
{
    // class: CDRLogImport
    // 
    // summary: this class imports CDR access
    // logs into a database table
 
    function importFiles(files,srch)
    {    
        // function: importFiles(files : Array) : Boolean
        //
        // summary: imports the access logs from the input files; returns 
        // true if the files import successfully and false otherwise
		//alert("Hey " + srch + " there ");
        // if we don't have an output name, return false
        if (m_output.length == 0 || m_output == "/")
            return false;

        // if we don't have any input files, return false
        if (!files || files.length == 0)
            return false;

        // if a database isn't specified, use the host database
        if (!m_db)
            m_db = HostApp.getDatabase();

        // find out the total file size being imported
        var total_import_size = 0;
        for (var f in files)
        {
            var file_info = new FileInfo(files[f]);        
            total_import_size += file_info.getLength();
        }

        // create a new job to add to the job queue
        m_job = HostApp.createJob();
        m_job.setTitle("Importing CDR Logs");
        m_job.setMaximum(total_import_size);
        
        m_job.start();

        // create the table structure
        m_db.execute
        ("
            DROP TABLE IF EXISTS " + m_output + ";

            CREATE TABLE " + m_output + "
            (
                TimeOrigination VARCHAR(40),
                CallingNumber VARCHAR(40),
				OriginalCalledPartyNum VARCHAR(40),
                FinalCalledPartyNumber VARCHAR(40),
				Duration NUMERIC(8,0),
                OrigIP VARCHAR(40),
                DestIP VARCHAR(40),
                OrigDev VARCHAR(80),
                DestDev VARCHAR(80)
            );
        ");

        // import the files
        for (var f in files)
        {
            if (!processLogFile(files[f]))
                return false;
        }
		//This section here is to alter the table after the initial insert, and add the Dtime calculated field.
		m_db.execute
		("ALTER TABLE " + m_output + " ADD COLUMN Dtime DateTime AS DATE((TimeOrigination - 28800)* 1000)");
		
		//This will be to convert the duration field to an Hour:Minute:second format as a new calculated field called hms.
		m_db.execute
		("ALTER TABLE " + m_output + "
		ADD COLUMN hms Character(11)
		AS str(trunc(Duration/3600)) + \":\" + str(trunc(sum(Mod(Duration,3600)/60))) + \":\" + str(mod(mod(Duration,3600),60))");
        // Clean first row issue
        m_db.execute("DELETE FROM " + m_output + " WHERE DestDev = \"destDeviceName\"");
		
/* *****************************Table1********************************************* */	
        // This section Creates The international_IN_INTL table
		m_db.execute
		("
			DROP TABLE IF EXISTS International_IN_INTL;
			
			CREATE TABLE International_IN_INTL
			(
				Dtime DateTime,
				CallingNumber VARCHAR(40),
				OriginalCalledPartyNum VARCHAR(40),
				FinalCalledPartyNumber VARCHAR(40),
                DestDev VARCHAR(80),
                Duration NUMERIC(8,0),
				HMS VARCHAR(20)
			);
		");

			//Now insert just what we want into new "m_output"aaa table.
			m_db.execute
			("
				INSERT INTO International_IN_INTL SELECT * from " + m_output + ";
			");
            // adding alter commands for new columns
        m_db.execute
        ("ALTER TABLE International_IN_INTL
        ADD COLUMN CountryCode2digit VARCHAR(40)
        AS right(left(CallingNumber,02),2)");            

        // adding alter command to add CountryCode3digit
        m_db.execute
        ("ALTER TABLE International_IN_INTL
        ADD COLUMN CountryCode3digit VARCHAR(40)
        AS right(left(CallingNumber,03),3)");         

/* ****************************Table2************************************************ */	
        // This section will create the International_IN_NAMP table
        m_db.execute
        ("
            DROP TABLE IF EXISTS International_IN_NANP;
            
            CREATE TABLE International_IN_NANP
            (
                Dtime DateTime,
                CallingNumber VARCHAR(40),
                OriginalCalledPartyNum VARCHAR(40),
                FinalCalledPartyNumber VARCHAR(40),
                DestDev VARCHAR(80),
                Duration NUMERIC(8,0),
                HMS VARCHAR(20)
            );
        ");

            //Now insert just what we want into new "m_output"aaa table.
            m_db.execute
            ("
                INSERT INTO International_IN_NANP SELECT * from " + m_output + ";
            ");
            // adding alter commands for new columns
        m_db.execute
        ("ALTER TABLE International_IN_NANP
        ADD COLUMN AreaCode VARCHAR(40)
        AS right(left(CallingNumber,03),3)");  

/* ****************************Table3************************************************ */    
        // This section will create the International_IN_NAMP table
        m_db.execute
        ("
            DROP TABLE IF EXISTS International_OUT_INTL;
            
            CREATE TABLE International_OUT_INTL
            (
                Dtime DateTime,
                CallingNumber VARCHAR(40),
                OriginalCalledPartyNum VARCHAR(40),
                FinalCalledPartyNumber VARCHAR(40),
                DestDev VARCHAR(80),
                Duration NUMERIC(8,0),
                HMS VARCHAR(20)
            );
        ");

            //Now insert just what we want into new "m_output"aaa table.
            m_db.execute
            ("
                INSERT INTO International_OUT_INTL SELECT * from " + m_output + ";
            ");
            // adding alter commands for new columns
        m_db.execute
        ("ALTER TABLE International_OUT_INTL
        ADD COLUMN OCPNfirst3 VARCHAR(40)
        AS right(left(OriginalCalledPartyNum,03),3)");    

        // adding CountryCode2digit
        m_db.execute
        ("ALTER TABLE International_OUT_INTL
        ADD COLUMN CountryCode2digit VARCHAR(40)
        AS right(left(OriginalCalledPartyNum,05),2)");

        // adding CountryCode3digit
        m_db.execute
        ("ALTER TABLE International_OUT_INTL
        ADD COLUMN CountryCode3digit VARCHAR(40)
        AS right(left(OriginalCalledPartyNum,06),3)");  


/* ****************************Table4************************************************ */    
        // This section will create the International_IN_NAMP table
        m_db.execute
        ("
            DROP TABLE IF EXISTS International_OUT_NANP;
            
            CREATE TABLE International_OUT_NANP
            (
                Dtime DateTime,
                CallingNumber VARCHAR(40),
                OriginalCalledPartyNum VARCHAR(40),
                FinalCalledPartyNumber VARCHAR(40),
                DestDev VARCHAR(80),
                Duration NUMERIC(8,0),
                HMS VARCHAR(20)
            );
        ");

            //Now insert just what we want into new "m_output"aaa table.
            m_db.execute
            ("
                INSERT INTO International_OUT_NANP SELECT * from " + m_output + ";
            ");
            // adding alter commands for new columns
        m_db.execute
        ("ALTER TABLE International_OUT_NANP
        ADD COLUMN AreaCode VARCHAR(40)
        AS right(left(OriginalCalledPartyNum,03),3)");    
                      
        		
		/*************************************end experimental******************************************************************/
		
		
        // finish the import job
        if (m_job)
        {
            m_job.finish();
            m_job.setTitle("Importing CDR Logs");
        }

        return true;
    }

    function processLogFile(filename)
    {
        // function: processLogFile(filename : String) : Boolean
        //
        // summary: parses each line in the file specified by filename,
        // and appends the results to the output table; returns true
        // if the file is processed successfully, and false otherwise

        // if we don't have an output name, return false
        if (m_output.length == 0 || m_output == "/")
        {
            cancelImport();
            return false;
        }

        // update the job's title
        if (m_job)
            m_job.setTitle("Importing CDR Logs (" + filename + ")");

        // try to open the text file
        var reader = File.openText(filename);
        if (!reader)
        {
            cancelImport();
            return false;
        }

        // create a table inserter to insert the parsed values into the table
        var inserter = m_db.bulkInsert(m_output, "TimeOrigination, CallingNumber, OriginalCalledPartyNum, FinalCalledPartyNumber, Duration, OrigIP, DestIP, OrigDev, DestDev");
 
        // read all the files
        var line = reader.readLine();
        while (line)
        {
            // see if the job is cancelled; if it is, return false
            if (m_job.isCancelling())
            {
                m_job.cancel();
                return false;
            }


                //results = line.split("delimeter");
				var lineSplit = line.split(",");

            inserter[0] = lineSplit[4];                      // Date Time Origination
            inserter[1] = lineSplit[8];       			   // Calling Party
            inserter[2] = lineSplit[29];                     // Original Called Party
            inserter[3] = lineSplit[30];                     // Final Called Party
            inserter[4] = lineSplit[55];                     // Duration
            inserter[5] = lineSplit[80];                  // original ipv4 or v6 address
            inserter[6] = lineSplit[81];                    // Dest ipv4 or v6 address
            inserter[7] = lineSplit[56];                    // Originating Device name
            inserter[8] = lineSplit[57];                    // Destination Device Name

			
            inserter.insertRow();

            line = reader.readLine();
            
            // increment the job status
            m_job.setValue(m_job.getValue() + line.length);
        }

        // close the file and finish the insert
        reader.close();
        inserter.finishInsert();
        
        return true;
    }

    function cancelImport()
    {
        // function: cancelImport()
        //
        // summary: cancels the import job

        if (m_job)
        {
            m_job.cancel();
            m_job.setTitle("Importing CDR Logs");
        }
    }

    function setDatabase(db)
    {
        // function: setDatabase(database : String)
        //
        // summary: sets the database to which to import the
        // access logs from the specified input connection
        // string

        m_db = db;
    }
    
    function setOutputTable(output)
    {
        // function: setOutputTable(output : String)
        //
        // summary: sets the output table to which to import
        // the access logs from the specified input path
    
        m_output = output;
    }


    // member variables
    var m_db;
    var m_job;
    var m_output;
	var search_extension;
}

